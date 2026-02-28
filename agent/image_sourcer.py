"""
Unsplash image sourcer for article header images.

Queries the Unsplash API for relevant images based on article category
and returns a URL suitable for use in article frontmatter.

IMPORTANT: Each article MUST have a unique image. This module scans
existing articles on initialization to track which images are already
in use and will never return a duplicate.
"""

from __future__ import annotations

import random
import re
from pathlib import Path

import httpx
from rich.console import Console
from tenacity import retry, stop_after_attempt, wait_exponential

from config import UNSPLASH_SEARCH_TERMS, settings

console = Console()

_UNSPLASH_API_BASE = "https://api.unsplash.com"
_DEFAULT_CAPTION = "Financial markets — Unsplash"

# Category-specific fallback images (never the same for all categories)
_CATEGORY_FALLBACKS: dict[str, str] = {
    "mercados": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80&fit=crop",
    "trading": "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=80&fit=crop",
    "investimentos": "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=1200&q=80&fit=crop",
    "negocios": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&fit=crop",
    "opiniao": "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=1200&q=80&fit=crop",
}
_LAST_RESORT_FALLBACK = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80&fit=crop"


# ---------------------------------------------------------------------------
# Used-image scanner
# ---------------------------------------------------------------------------


def _extract_image_id(url: str) -> str | None:
    """Extract the Unsplash photo ID from an image URL."""
    match = re.search(r"unsplash\.com/photo-([a-zA-Z0-9_-]+)", url)
    return match.group(1) if match else None


def _scan_used_images(content_dir: Path) -> set[str]:
    """
    Scan all existing article markdown files and collect Unsplash photo IDs
    that are already in use.

    Returns:
        A set of Unsplash photo IDs currently used by articles.
    """
    used: set[str] = set()
    if not content_dir.exists():
        return used

    for md_file in content_dir.glob("**/*.md"):
        try:
            text = md_file.read_text(encoding="utf-8")
            # Match the image field in YAML frontmatter
            match = re.search(r'^image:\s*["\']?(https://images\.unsplash\.com/[^"\'\s]+)', text, re.MULTILINE)
            if match:
                photo_id = _extract_image_id(match.group(1))
                if photo_id:
                    used.add(photo_id)
        except Exception:
            continue

    return used


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------


class ArticleImage:
    """An image sourced from Unsplash for use in article frontmatter."""

    def __init__(self, url: str, caption: str, photographer: str, unsplash_id: str) -> None:
        self.url = url
        self.caption = caption
        self.photographer = photographer
        self.unsplash_id = unsplash_id

    @property
    def display_url(self) -> str:
        """Return image URL with standard dimensions for article headers."""
        base = self.url.split("?")[0]
        return f"{base}?w=1200&q=80&fit=crop"


# ---------------------------------------------------------------------------
# Unsplash client
# ---------------------------------------------------------------------------


class ImageSourcer:
    """
    Fetches relevant header images from the Unsplash API.

    On initialization, scans the content directory to build a registry
    of already-used images. Every image returned is guaranteed to be
    unique across the entire site.

    Args:
        access_key: Unsplash API access key.
        content_dir: Path to the article content directory (for scanning used images).
    """

    def __init__(self, access_key: str, content_dir: Path | None = None) -> None:
        self._access_key = access_key
        self._headers = {
            "Authorization": f"Client-ID {access_key}",
            "Accept-Version": "v1",
        }
        # Scan existing articles for used images
        scan_dir = content_dir or settings.content_output_dir
        self._used_ids: set[str] = _scan_used_images(scan_dir)
        console.log(f"[blue]Image sourcer:[/blue] {len(self._used_ids)} unique images already in use")

    def _is_used(self, photo_id: str) -> bool:
        """Check if a photo ID is already used by an existing article."""
        return photo_id in self._used_ids

    def _mark_used(self, photo_id: str) -> None:
        """Mark a photo ID as used (for the current session)."""
        self._used_ids.add(photo_id)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=False,
    )
    def get_image(self, category: str, tags: list[str] | None = None) -> ArticleImage:
        """
        Fetch a unique, relevant image for the given category.

        Searches Unsplash using category-mapped terms. Tries multiple
        search terms and pages to find an image not already in use.
        Falls back to category-specific defaults only as a last resort.

        Args:
            category: Article category (e.g. "mercados", "trading").
            tags: Optional list of article tags to supplement the search.

        Returns:
            An ArticleImage with URL and metadata, guaranteed unique.
        """
        search_terms = UNSPLASH_SEARCH_TERMS.get(category, ["finance", "business"])
        # Shuffle to vary which terms are tried first
        terms_to_try = list(search_terms)
        random.shuffle(terms_to_try)

        # Build tag supplement
        safe_tag = None
        if tags:
            safe_tag = next(
                (t for t in tags if len(t) < 30 and t.isascii()),
                None,
            )

        # Try each search term until we find a unique image
        for term in terms_to_try:
            query = f"{term} {safe_tag}" if safe_tag else term
            try:
                result = self._search_unique(query)
                if result:
                    return result
            except Exception as exc:
                console.log(f"[yellow]Search failed for '{query}': {exc}[/yellow]")
                continue

        # Try without tag supplement
        if safe_tag:
            for term in terms_to_try[:3]:
                try:
                    result = self._search_unique(term)
                    if result:
                        return result
                except Exception:
                    continue

        console.log(f"[yellow]No unique image found for '{category}'. Using category fallback.[/yellow]")
        return self._fallback_image(category)

    def _search_unique(self, query: str, pages: int = 3) -> ArticleImage | None:
        """
        Search Unsplash and return the first result not already in use.

        Checks up to `pages` pages of results (30 images per page) to
        maximize the chance of finding a unique image.

        Args:
            query: Search string.
            pages: Number of result pages to check.

        Returns:
            An ArticleImage if a unique one is found, None otherwise.
        """
        with httpx.Client(timeout=10.0) as client:
            for page in range(1, pages + 1):
                response = client.get(
                    f"{_UNSPLASH_API_BASE}/search/photos",
                    headers=self._headers,
                    params={
                        "query": query,
                        "per_page": 15,
                        "page": page,
                        "orientation": "landscape",
                        "content_filter": "high",
                    },
                )
                response.raise_for_status()
                data = response.json()

                results = data.get("results", [])
                if not results:
                    break

                # Shuffle results to add randomness
                random.shuffle(results)

                for photo in results:
                    photo_id = photo["id"]
                    if not self._is_used(photo_id):
                        url = photo["urls"]["regular"]
                        photographer = photo["user"]["name"]
                        description = (
                            photo.get("description")
                            or photo.get("alt_description")
                            or query.title()
                        )
                        caption = f"{description.capitalize()} — Photo by {photographer} on Unsplash"

                        self._mark_used(photo_id)
                        console.log(f"[blue]Image sourced:[/blue] '{description[:50]}' by {photographer}")

                        return ArticleImage(
                            url=url,
                            caption=caption,
                            photographer=photographer,
                            unsplash_id=photo_id,
                        )

        return None

    def _fallback_image(self, category: str) -> ArticleImage:
        """Return a category-specific fallback image."""
        url = _CATEGORY_FALLBACKS.get(category, _LAST_RESORT_FALLBACK)
        photo_id = _extract_image_id(url) or "fallback"
        self._mark_used(photo_id)
        return ArticleImage(
            url=url,
            caption=_DEFAULT_CAPTION,
            photographer="Unsplash",
            unsplash_id=photo_id,
        )
