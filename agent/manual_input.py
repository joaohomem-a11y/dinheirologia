"""
Manual content input processor for the Dinheirologia content agent.

Reads a JSON file containing premium or manually-written articles from the
site owner, processes them through the rewriter/translator/publisher pipeline,
and marks them as consumed to avoid duplicate publishing.

JSON schema for manual_input.json:
[
  {
    "id": "unique-string-id",
    "title": "Article title in Portuguese",
    "body": "Full article body in Portuguese markdown",
    "category": "mercados|trading|investimentos|negocios|opiniao",
    "tags": ["tag1", "tag2"],
    "featured": false,
    "translate": true,
    "processed": false
  }
]

Fields:
    id          -- Unique identifier. Used to prevent reprocessing.
    title       -- Article title (Portuguese). Required.
    body        -- Article body in Markdown (Portuguese). Required.
    category    -- One of the valid site categories. Required.
    tags        -- List of tags. Optional, defaults to [].
    featured    -- Whether to mark this article as featured. Defaults to false.
    translate   -- Whether to translate to EN/ES. Defaults to true.
    processed   -- Set to true by the agent after publishing. Do not edit manually.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from rich.console import Console

from config import OWNER_AUTHOR, VALID_CATEGORIES, settings

console = Console()


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------


@dataclass
class ManualArticle:
    """A manually-submitted article from the site owner."""

    id: str
    title: str
    body: str
    category: str
    tags: list[str]
    featured: bool
    translate: bool

    @property
    def url_hash(self) -> str:
        """Derive a stable hash from the article id for slug generation."""
        return hashlib.sha256(self.id.encode()).hexdigest()[:16]

    @property
    def published_at(self) -> str:
        """Return today's date as the publication date."""
        return datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")

    @property
    def author(self) -> str:
        """Manual articles always use the owner's byline."""
        return OWNER_AUTHOR


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------


class ManualInputError(Exception):
    """Raised when a manual input record fails validation."""


def _validate_record(record: dict[str, Any], index: int) -> None:
    """
    Validate a single manual input record.

    Args:
        record: The raw dict from the JSON file.
        index: The record index (for error messages).

    Raises:
        ManualInputError: If any required field is missing or invalid.
    """
    required = ("id", "title", "body", "category")
    for field in required:
        if not record.get(field):
            raise ManualInputError(
                f"Record[{index}] missing required field '{field}'"
            )

    category = record["category"]
    if category not in VALID_CATEGORIES:
        raise ManualInputError(
            f"Record[{index}] has invalid category '{category}'. "
            f"Valid options: {VALID_CATEGORIES}"
        )

    if len(record["body"]) < 100:
        raise ManualInputError(
            f"Record[{index}] body is too short ({len(record['body'])} chars). "
            "Minimum is 100 characters."
        )


# ---------------------------------------------------------------------------
# Loader
# ---------------------------------------------------------------------------


class ManualInputProcessor:
    """
    Loads and manages manual article submissions from a JSON file.

    Args:
        input_file: Path to the manual_input.json file.
    """

    def __init__(self, input_file: Path) -> None:
        self._path = input_file

    def load_pending(self) -> list[ManualArticle]:
        """
        Load all unprocessed articles from the input JSON file.

        Returns:
            List of ManualArticle objects that have not yet been processed.
        """
        if not self._path.exists():
            console.log(
                f"[dim]No manual input file found at {self._path}. Skipping.[/dim]"
            )
            return []

        try:
            records: list[dict[str, Any]] = json.loads(
                self._path.read_text(encoding="utf-8")
            )
        except json.JSONDecodeError as exc:
            console.log(f"[red]Failed to parse manual_input.json: {exc}[/red]")
            return []

        if not isinstance(records, list):
            console.log("[red]manual_input.json must be a JSON array.[/red]")
            return []

        articles: list[ManualArticle] = []
        for i, record in enumerate(records):
            if record.get("processed", False):
                continue
            try:
                _validate_record(record, i)
            except ManualInputError as exc:
                console.log(f"[red]Validation error: {exc}[/red]")
                continue

            articles.append(
                ManualArticle(
                    id=record["id"],
                    title=record["title"],
                    body=record["body"],
                    category=record["category"],
                    tags=record.get("tags", []),
                    featured=record.get("featured", False),
                    translate=record.get("translate", True),
                )
            )

        console.log(
            f"[blue]Manual input:[/blue] {len(articles)} pending article(s) found."
        )
        return articles

    def mark_processed(self, article_id: str) -> None:
        """
        Mark an article as processed in the JSON file so it is not republished.

        Args:
            article_id: The id field of the article to mark.
        """
        if not self._path.exists():
            return

        try:
            records: list[dict[str, Any]] = json.loads(
                self._path.read_text(encoding="utf-8")
            )
        except json.JSONDecodeError:
            return

        for record in records:
            if record.get("id") == article_id:
                record["processed"] = True
                break

        self._path.write_text(
            json.dumps(records, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        console.log(f"[dim]Marked manual article '{article_id}' as processed.[/dim]")

    @staticmethod
    def create_example(output_path: Path) -> None:
        """
        Write an example manual_input.json file to the given path.

        Args:
            output_path: Where to write the example file.
        """
        example = [
            {
                "id": "exemplo-fed-juros-2026",
                "title": "O Fed Subiu os Juros e o Brasil Vai Pagar a Conta",
                "body": (
                    "## A Conta Chegou\n\n"
                    "Todo mundo sabia que ia acontecer. O Fed subiu mais 25 pontos base "
                    "e agora o dinheiro barato acabou de vez...\n\n"
                    "Escreva seu artigo completo aqui em Markdown."
                ),
                "category": "mercados",
                "tags": ["fed", "juros", "política monetária", "dólar"],
                "featured": False,
                "translate": True,
                "processed": False,
            }
        ]
        output_path.write_text(
            json.dumps(example, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        console.log(f"[green]Example manual_input.json written to {output_path}[/green]")
