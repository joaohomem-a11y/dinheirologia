"""
Drop folder processor for the Dinheirologia content agent.

Reads article files manually dropped into agent/drop_articles/ (from sources
that block automated scraping like Seeking Alpha, Investopedia, FT, Gavekal),
parses their header+body format, and returns RawArticle objects ready for the
standard rewrite pipeline.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from pathlib import Path

from fetcher import RawArticle

log = logging.getLogger("dinheirologia.agent")


class DropFolderProcessor:
    """Processes article files dropped into the drop folder."""

    # Subfolder name -> default metadata
    FOLDER_DEFAULTS: dict[str, dict[str, str]] = {
        "seeking-alpha": {
            "source_name": "Seeking Alpha",
            "category": "investimentos",
            "content_type": "artigo",
            "language": "en",
        },
        "investopedia": {
            "source_name": "Investopedia",
            "category": "investimentos",
            "content_type": "artigo",
            "language": "en",
        },
        "ft": {
            "source_name": "Financial Times",
            "category": "mercados",
            "content_type": "artigo",
            "language": "en",
        },
        "gavekal": {
            "source_name": "Gavekal Research",
            "category": "mercados",
            "content_type": "artigo",
            "language": "en",
        },
    }

    # Header fields we recognise (uppercase key -> attribute name)
    _HEADER_KEYS = {"FONTE", "TITULO", "CATEGORIA", "TIPO"}

    def __init__(self, drop_dir: Path) -> None:
        self._drop_dir = drop_dir

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def load_articles(self) -> list[tuple[RawArticle, Path]]:
        """
        Scan the drop folder for ``.md`` / ``.txt`` files and parse them.

        Returns:
            A list of ``(RawArticle, file_path)`` tuples.  The caller should
            delete *file_path* after successful processing.
        """
        if not self._drop_dir.exists():
            return []

        results: list[tuple[RawArticle, Path]] = []

        for path in sorted(self._drop_dir.rglob("*")):
            if path.suffix.lower() not in (".md", ".txt"):
                continue
            if path.name.upper() == "README.MD":
                continue

            article = self._parse_file(path)
            if article is not None:
                results.append((article, path))

        if results:
            log.info("Drop folder: found %d article(s) to process", len(results))

        return results

    def delete_processed(self, file_path: Path) -> None:
        """Delete a processed article file from the drop folder."""
        try:
            file_path.unlink()
            log.info("Deleted processed drop file: %s", file_path.name)
        except OSError as exc:
            log.warning("Could not delete drop file %s: %s", file_path, exc)

    # ------------------------------------------------------------------
    # Internal parsing
    # ------------------------------------------------------------------

    def _parse_file(self, path: Path) -> RawArticle | None:
        """
        Parse a single drop-folder file into a ``RawArticle``.

        Expected format::

            FONTE: <source name>
            TITULO: <title>
            CATEGORIA: <category>
            TIPO: <content type>

            <body text>

        Returns ``None`` (with a warning) if the file lacks a TITULO header
        or has an empty body.
        """
        try:
            text = path.read_text(encoding="utf-8")
        except Exception as exc:
            log.warning("Cannot read drop file %s: %s", path, exc)
            return None

        header, body = self._split_header_body(text)

        # TITULO is mandatory
        title = header.get("TITULO")
        if not title:
            log.warning(
                "Drop file %s has no TITULO header — skipping", path.name
            )
            return None

        body = body.strip()
        if not body:
            log.warning("Drop file %s has an empty body — skipping", path.name)
            return None

        # Resolve defaults from subfolder
        subfolder = self._get_subfolder(path)
        defaults = self.FOLDER_DEFAULTS.get(subfolder, {})

        source_name = header.get("FONTE") or defaults.get("source_name", "Drop Folder")
        category = header.get("CATEGORIA") or defaults.get("category", "mercados")
        content_type = header.get("TIPO") or defaults.get("content_type", "artigo")
        language = defaults.get("language", "en")

        # Build a synthetic URL so the hash is unique per file
        synthetic_url = f"drop://{path.name}"

        return RawArticle(
            url=synthetic_url,
            title=title,
            body=body,
            summary=body[:500],
            published_at=datetime.now(tz=timezone.utc),
            source_name=source_name,
            source_url=f"drop://{source_name}",
            category=category,
            language=language,
            content_type=content_type,
        )

    def _split_header_body(self, text: str) -> tuple[dict[str, str], str]:
        """Split raw text into a header dict and body string."""
        header: dict[str, str] = {}
        lines = text.splitlines()
        body_start = 0

        for i, line in enumerate(lines):
            stripped = line.strip()

            # Empty line marks end of header block
            if not stripped:
                body_start = i + 1
                break

            # Try to parse as a header field
            colon_pos = stripped.find(":")
            if colon_pos > 0:
                key = stripped[:colon_pos].strip().upper()
                if key in self._HEADER_KEYS:
                    header[key] = stripped[colon_pos + 1 :].strip()
                    continue

            # If we hit a non-header line before an empty line, treat
            # everything from here as body (no header).
            body_start = i
            break

        body = "\n".join(lines[body_start:])
        return header, body

    def _get_subfolder(self, path: Path) -> str:
        """Return the immediate subfolder name relative to drop_dir, or ''."""
        try:
            relative = path.relative_to(self._drop_dir)
            parts = relative.parts
            if len(parts) > 1:
                return parts[0]
        except ValueError:
            pass
        return ""
