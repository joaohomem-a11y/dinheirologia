"""
Unsplash image sourcer for article header images.

Queries the Unsplash API for relevant images based on article category
and returns a URL suitable for use in article frontmatter.
"""

from __future__ import annotations

import random
from dataclasses import dataclass

import httpx
from rich.console import Console
from tenacity import retry, stop_after_attempt, wait_exponential

from config import UNSPLASH_SEARCH_TERMS, settings

console = Console()

_UNSPLASH_API_BASE = "https://api.unsplash.com"
_DEFAULT_IMAGE = (
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
    "?w=1200&q=80&fit=crop"
)
_DEFAULT_CAPTION = "Financial markets — Unsplash"


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------


@dataclass
class ArticleImage:
    """An image sourced from Unsplash for use in article frontmatter."""

    url: str
    caption: str
    photographer: str
    unsplash_id: str

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

    Args:
        access_key: Unsplash API access key.
    """

    def __init__(self, access_key: str) -> None:
        self._access_key = access_key
        self._headers = {
            "Authorization": f"Client-ID {access_key}",
            "Accept-Version": "v1",
        }

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=False,
    )
    def get_image(self, category: str, tags: list[str] | None = None) -> ArticleImage:
        """
        Fetch a relevant image for the given category.

        Searches Unsplash using category-mapped terms, with a fallback
        to tag-based search, then to a hardcoded default image.

        Args:
            category: Article category (e.g. "mercados", "trading").
            tags: Optional list of article tags to supplement the search.

        Returns:
            An ArticleImage with URL and metadata.
        """
        # Build search query
        search_terms = UNSPLASH_SEARCH_TERMS.get(category, ["finance", "business"])
        query = random.choice(search_terms)

        # Supplement with a tag if available
        if tags:
            safe_tag = next(
                (t for t in tags if len(t) < 30 and t.isascii()),
                None,
            )
            if safe_tag:
                query = f"{query} {safe_tag}"

        try:
            return self._search(query)
        except Exception as exc:
            console.log(f"[yellow]Unsplash search failed for '{query}': {exc}. Using default.[/yellow]")
            return self._default_image()

    def _search(self, query: str) -> ArticleImage:
        """
        Perform the Unsplash search API call.

        Args:
            query: Search string.

        Returns:
            An ArticleImage from the search results.

        Raises:
            httpx.HTTPError: On network or API errors.
            ValueError: If no results are returned.
        """
        with httpx.Client(timeout=10.0) as client:
            response = client.get(
                f"{_UNSPLASH_API_BASE}/search/photos",
                headers=self._headers,
                params={
                    "query": query,
                    "per_page": 10,
                    "orientation": "landscape",
                    "content_filter": "high",
                },
            )
            response.raise_for_status()
            data = response.json()

        results = data.get("results", [])
        if not results:
            raise ValueError(f"No Unsplash results for query: '{query}'")

        # Pick a random result from the top 5 to avoid always using the same image
        photo = random.choice(results[:5])
        url = photo["urls"]["regular"]
        photographer = photo["user"]["name"]
        description = (
            photo.get("description")
            or photo.get("alt_description")
            or query.title()
        )
        caption = f"{description.capitalize()} — Photo by {photographer} on Unsplash"

        console.log(f"[blue]Image sourced:[/blue] '{description[:50]}' by {photographer}")

        return ArticleImage(
            url=url,
            caption=caption,
            photographer=photographer,
            unsplash_id=photo["id"],
        )

    @staticmethod
    def _default_image() -> ArticleImage:
        """Return the hardcoded fallback image when Unsplash is unavailable."""
        return ArticleImage(
            url=_DEFAULT_IMAGE,
            caption=_DEFAULT_CAPTION,
            photographer="Unsplash",
            unsplash_id="default",
        )
