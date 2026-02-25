"""
Markdown publisher for the Dinheirologia content agent.

Creates locale-specific markdown files with YAML frontmatter for
the Next.js site, organized by language subdirectory.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml
from rich.console import Console
from slugify import slugify

from config import settings
from image_sourcer import ArticleImage
from rewriter import RewrittenArticle
from translator import TranslatedContent

console = Console()

# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------


@dataclass
class PublishResult:
    """Tracks the output paths of a published article."""

    slug: str
    paths: dict[str, Path]  # lang -> file path
    title_pt: str


# ---------------------------------------------------------------------------
# Frontmatter builder
# ---------------------------------------------------------------------------


def _build_frontmatter(
    title: str,
    subtitle: str,
    author: str,
    category: str,
    tags: list[str],
    image: ArticleImage,
    body: str,
    published_date: str,
    featured: bool = False,
    lang: str = "pt",
    content_type: str = "noticia",
) -> dict[str, Any]:
    """
    Build the frontmatter dictionary for a markdown article.

    Args:
        title: Article title.
        subtitle: Optional subtitle (empty string if none).
        author: Author display name.
        category: Content category slug.
        tags: List of article tags.
        image: Sourced header image.
        body: Article body text (used to derive excerpt).
        published_date: ISO date string (YYYY-MM-DD).
        featured: Whether this article is featured on the homepage.
        lang: Language code for this version of the article.

    Returns:
        Dict ready for YAML serialization.
    """
    author_slug = slugify(author, max_length=60)
    excerpt = _make_excerpt(body, max_chars=200)

    fm: dict[str, Any] = {
        "title": title,
        "date": published_date,
        "author": author,
        "authorSlug": author_slug,
        "category": category,
        "tags": tags,
        "image": image.display_url,
        "imageCaption": image.caption,
        "excerpt": excerpt,
        "contentType": content_type,
        "featured": featured,
        "lang": lang,
    }

    if subtitle:
        fm["subtitle"] = subtitle

    return fm


def _make_excerpt(body: str, max_chars: int = 200) -> str:
    """
    Extract a plain-text excerpt from the article body.

    Strips Markdown formatting and returns the first `max_chars` characters,
    trimmed at a word boundary.

    Args:
        body: Markdown body text.
        max_chars: Maximum character count for the excerpt.

    Returns:
        Plain text excerpt.
    """
    # Remove markdown syntax
    text = re.sub(r"#+\s*", "", body)          # headings
    text = re.sub(r"\*{1,3}(.+?)\*{1,3}", r"\1", text)  # bold/italic
    text = re.sub(r"`{1,3}[^`]*`{1,3}", "", text)         # code
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)  # links
    text = re.sub(r">\s*", "", text)           # blockquotes
    text = re.sub(r"\n+", " ", text)           # newlines to spaces
    text = re.sub(r"\s{2,}", " ", text)        # collapse spaces
    text = text.strip()

    if len(text) <= max_chars:
        return text

    # Trim at word boundary
    trimmed = text[:max_chars]
    last_space = trimmed.rfind(" ")
    if last_space > max_chars * 0.7:
        trimmed = trimmed[:last_space]
    return trimmed + "..."


def _render_markdown(frontmatter: dict[str, Any], body: str) -> str:
    """
    Render a complete markdown file string with YAML frontmatter.

    Args:
        frontmatter: Dict of frontmatter key-value pairs.
        body: Article body in Markdown.

    Returns:
        Full markdown file content as a string.
    """
    # Use default_flow_style=False for readable multi-line YAML
    fm_yaml = yaml.dump(
        frontmatter,
        allow_unicode=True,
        default_flow_style=False,
        sort_keys=False,
    ).strip()

    return f"---\n{fm_yaml}\n---\n\n{body}\n"


# ---------------------------------------------------------------------------
# Publisher
# ---------------------------------------------------------------------------


class ArticlePublisher:
    """
    Writes localized markdown files to the Next.js content directory.

    Directory structure produced:
        <content_output_dir>/
            pt/<slug>.md
            en/<slug>.md
            es/<slug>.md

    Args:
        output_dir: Root content directory path.
    """

    def __init__(self, output_dir: Path) -> None:
        self._output_dir = output_dir
        self._ensure_dirs()

    def _ensure_dirs(self) -> None:
        """Create language subdirectories if they do not exist."""
        for lang in ("pt", "en", "es"):
            (self._output_dir / lang).mkdir(parents=True, exist_ok=True)

    def publish(
        self,
        article: RewrittenArticle,
        translations: dict[str, TranslatedContent],
        image: ArticleImage,
        featured: bool = False,
        content_type: str = "noticia",
    ) -> PublishResult:
        """
        Write all language versions of an article to disk.

        Args:
            article: The rewritten Portuguese article.
            translations: Dict of translated content keyed by language code.
            image: Header image sourced from Unsplash.
            featured: Whether to mark this article as featured.

        Returns:
            PublishResult with the slug and output paths.
        """
        slug = self._make_slug(article.title_pt, article.url_hash)
        paths: dict[str, Path] = {}

        # --- Portuguese (canonical) ---
        pt_fm = _build_frontmatter(
            title=article.title_pt,
            subtitle=article.subtitle_pt,
            author=article.author,
            category=article.category,
            tags=article.tags,
            image=image,
            body=article.body_pt,
            published_date=article.published_at,
            featured=featured,
            lang="pt",
            content_type=content_type,
        )
        pt_path = self._write(slug, "pt", pt_fm, article.body_pt)
        paths["pt"] = pt_path

        # --- English ---
        if "en" in translations:
            en = translations["en"]
            en_fm = _build_frontmatter(
                title=en.title,
                subtitle=en.subtitle,
                author=article.author,
                category=article.category,
                tags=article.tags,
                image=image,
                body=en.body,
                published_date=article.published_at,
                featured=featured,
                lang="en",
                content_type=content_type,
            )
            en_path = self._write(slug, "en", en_fm, en.body)
            paths["en"] = en_path

        # --- Spanish ---
        if "es" in translations:
            es = translations["es"]
            es_fm = _build_frontmatter(
                title=es.title,
                subtitle=es.subtitle,
                author=article.author,
                category=article.category,
                tags=article.tags,
                image=image,
                body=es.body,
                published_date=article.published_at,
                featured=featured,
                lang="es",
                content_type=content_type,
            )
            es_path = self._write(slug, "es", es_fm, es.body)
            paths["es"] = es_path

        console.log(
            f"[bold green]Published[/bold green] '{article.title_pt[:60]}' "
            f"-> {slug} ({', '.join(paths.keys())})"
        )
        return PublishResult(slug=slug, paths=paths, title_pt=article.title_pt)

    def _write(
        self,
        slug: str,
        lang: str,
        frontmatter: dict[str, Any],
        body: str,
    ) -> Path:
        """
        Write a single language version to disk.

        Args:
            slug: Article slug used as the filename.
            lang: Language code subdirectory.
            frontmatter: Frontmatter dict.
            body: Article body in Markdown.

        Returns:
            Path to the written file.
        """
        content = _render_markdown(frontmatter, body)
        # PT files go in the root artigos/ dir; EN/ES go in subdirectories
        # This matches the Next.js site reader convention in lib/articles.ts
        if lang == "pt":
            file_path = self._output_dir / f"{slug}.md"
        else:
            file_path = self._output_dir / lang / f"{slug}.md"
        file_path.write_text(content, encoding="utf-8")
        return file_path

    @staticmethod
    def _make_slug(title: str, url_hash: str) -> str:
        """
        Generate a unique, URL-safe slug from the article title.

        Appends the first 6 chars of the URL hash to guarantee uniqueness
        even if two articles share a title after slugification.

        Args:
            title: Article title in Portuguese.
            url_hash: Short hash derived from the source URL.

        Returns:
            A slug string like "fed-sobe-juros-novamente-a1b2c3".
        """
        base_slug = slugify(title, max_length=70, word_boundary=True)
        return f"{base_slug}-{url_hash[:6]}"
