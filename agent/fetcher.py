"""
RSS feed fetcher and article parser for the Dinheirologia content agent.

Fetches articles from configured RSS feeds, cleans HTML content,
and returns structured article data ready for rewriting.
"""

from __future__ import annotations

import hashlib
import json
import re
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterator

import feedparser
import httpx
from bs4 import BeautifulSoup
from rich.console import Console
from tenacity import retry, stop_after_attempt, wait_exponential

from config import RSS_FEEDS, settings

console = Console()


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------


@dataclass
class RawArticle:
    """A raw article fetched from an RSS feed before any processing."""

    url: str
    title: str
    body: str
    summary: str
    published_at: datetime
    source_name: str
    source_url: str
    category: str
    language: str
    url_hash: str = field(init=False)

    def __post_init__(self) -> None:
        self.url_hash = hashlib.sha256(self.url.encode()).hexdigest()[:16]

    @property
    def is_long_enough(self) -> bool:
        """Returns True if the article body meets the minimum length threshold."""
        return len(self.body) >= settings.min_article_length


# ---------------------------------------------------------------------------
# State tracking (already-processed URLs)
# ---------------------------------------------------------------------------


class ProcessedURLStore:
    """Persists the set of already-processed article URLs to avoid duplication."""

    def __init__(self, state_file: Path) -> None:
        self._path = state_file
        self._seen: set[str] = self._load()

    def _load(self) -> set[str]:
        if self._path.exists():
            try:
                data = json.loads(self._path.read_text(encoding="utf-8"))
                return set(data.get("processed_urls", []))
            except (json.JSONDecodeError, KeyError):
                return set()
        return set()

    def save(self) -> None:
        """Persist the current seen-URL set to disk."""
        self._path.write_text(
            json.dumps({"processed_urls": sorted(self._seen)}, indent=2),
            encoding="utf-8",
        )

    def has_seen(self, url: str) -> bool:
        return url in self._seen

    def mark_seen(self, url: str) -> None:
        self._seen.add(url)


# ---------------------------------------------------------------------------
# HTML cleaning helpers
# ---------------------------------------------------------------------------


def _clean_html(raw_html: str) -> str:
    """Strip HTML tags and normalize whitespace from article content."""
    if not raw_html:
        return ""
    soup = BeautifulSoup(raw_html, "lxml")
    # Remove script, style, nav, aside, figure elements
    for tag in soup(["script", "style", "nav", "aside", "figure", "figcaption", "iframe"]):
        tag.decompose()
    text = soup.get_text(separator="\n")
    # Collapse whitespace
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    text = "\n".join(chunk for chunk in chunks if chunk)
    # Remove excessive blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _parse_date(entry: feedparser.FeedParserDict) -> datetime:
    """Extract and normalize publication date from a feed entry."""
    for attr in ("published_parsed", "updated_parsed", "created_parsed"):
        t = getattr(entry, attr, None)
        if t:
            return datetime(*t[:6], tzinfo=timezone.utc)
    return datetime.now(tz=timezone.utc)


# ---------------------------------------------------------------------------
# Full article fetcher (follows link to scrape full text)
# ---------------------------------------------------------------------------


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=False,
)
def _fetch_full_text(url: str, client: httpx.Client) -> str:
    """
    Attempt to fetch the full article body from the article URL.

    Falls back to the RSS summary if fetching fails.
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (compatible; DinheirologiaBot/1.0; +https://dinheirologia.com)"
        ),
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9,pt-BR;q=0.8",
    }
    response = client.get(url, headers=headers, follow_redirects=True, timeout=15.0)
    response.raise_for_status()
    return _clean_html(response.text)


# ---------------------------------------------------------------------------
# Core fetcher
# ---------------------------------------------------------------------------


class FeedFetcher:
    """
    Fetches and parses RSS feeds, yielding clean RawArticle objects.

    Args:
        store: ProcessedURLStore used to skip already-processed articles.
    """

    def __init__(self, store: ProcessedURLStore) -> None:
        self._store = store

    def fetch_all(self) -> list[RawArticle]:
        """
        Fetch new articles from all configured RSS feeds.

        Returns:
            List of RawArticle objects not previously seen.
        """
        articles: list[RawArticle] = []
        with httpx.Client(timeout=20.0) as client:
            for feed_cfg in RSS_FEEDS:
                try:
                    feed_articles = list(
                        self._fetch_feed(feed_cfg, client)
                    )
                    articles.extend(feed_articles)
                    console.log(
                        f"[green]Fetched {len(feed_articles)} new articles "
                        f"from {feed_cfg['name']}[/green]"
                    )
                except Exception as exc:
                    console.log(
                        f"[red]Error fetching {feed_cfg['name']}: {exc}[/red]"
                    )
        return articles

    def _fetch_feed(
        self,
        feed_cfg: dict[str, str],
        client: httpx.Client,
    ) -> Iterator[RawArticle]:
        """Parse a single RSS feed and yield unseen articles up to the limit."""
        feed = feedparser.parse(feed_cfg["url"])
        count = 0

        for entry in feed.entries:
            if count >= settings.max_articles_per_feed:
                break

            url = entry.get("link", "")
            if not url or self._store.has_seen(url):
                continue

            # Get summary from RSS
            summary_html = (
                entry.get("summary", "")
                or entry.get("description", "")
                or ""
            )
            summary = _clean_html(summary_html)[:500]

            # Try to fetch the full article text
            body = ""
            try:
                full_text = _fetch_full_text(url, client)
                if full_text and len(full_text) > len(summary):
                    body = full_text
                else:
                    body = summary
            except Exception:
                body = summary

            # Skip articles that are too short
            if len(body) < settings.min_article_length:
                console.log(f"[dim]Skipping short article: {entry.get('title', url)[:60]}[/dim]")
                continue

            # Throttle to be polite
            time.sleep(0.5)

            article = RawArticle(
                url=url,
                title=_clean_html(entry.get("title", "Sem título")),
                body=body,
                summary=summary,
                published_at=_parse_date(entry),
                source_name=feed_cfg["name"],
                source_url=feed.feed.get("link", feed_cfg["url"]),
                category=feed_cfg["category"],
                language=feed_cfg["language"],
            )

            self._store.mark_seen(url)
            count += 1
            yield article
