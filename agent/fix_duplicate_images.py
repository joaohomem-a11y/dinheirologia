#!/usr/bin/env python3
"""
Fix duplicate images across existing articles.

Scans all article markdown files, identifies duplicate Unsplash images,
and replaces them with unique images from the Unsplash API.

Usage:
    python fix_duplicate_images.py              # Preview changes (dry run)
    python fix_duplicate_images.py --apply      # Apply changes
    python fix_duplicate_images.py --batch 50   # Process 50 articles per run
"""

from __future__ import annotations

import argparse
import random
import re
import sys
import time
from collections import Counter
from pathlib import Path

import httpx
from rich.console import Console
from rich.table import Table

from config import UNSPLASH_SEARCH_TERMS, settings

console = Console()

_UNSPLASH_API_BASE = "https://api.unsplash.com"


def _extract_image_id(url: str) -> str | None:
    """Extract the Unsplash photo ID from an image URL."""
    match = re.search(r"unsplash\.com/photo-([a-zA-Z0-9_-]+)", url)
    return match.group(1) if match else None


def _scan_articles(content_dir: Path) -> dict[str, list[Path]]:
    """
    Scan articles and group files by Unsplash photo ID.

    Returns:
        Dict mapping photo_id -> list of article file paths using that image.
    """
    image_to_files: dict[str, list[Path]] = {}

    for md_file in sorted(content_dir.glob("*.md")):  # PT articles only
        try:
            text = md_file.read_text(encoding="utf-8")
            match = re.search(
                r'^image:\s*["\']?(https://images\.unsplash\.com/[^"\'\s]+)',
                text,
                re.MULTILINE,
            )
            if match:
                photo_id = _extract_image_id(match.group(1))
                if photo_id:
                    image_to_files.setdefault(photo_id, []).append(md_file)
        except Exception:
            continue

    return image_to_files


def _find_duplicates(image_to_files: dict[str, list[Path]]) -> dict[str, list[Path]]:
    """Return only photo IDs that are used by more than one article."""
    return {pid: files for pid, files in image_to_files.items() if len(files) > 1}


def _search_unique_image(
    client: httpx.Client,
    headers: dict,
    query: str,
    used_ids: set[str],
    page: int = 1,
) -> tuple[str, str, str, str] | None:
    """
    Search Unsplash for a unique image not in used_ids.

    Returns:
        Tuple of (display_url, caption, photographer, photo_id) or None.
    """
    try:
        response = client.get(
            f"{_UNSPLASH_API_BASE}/search/photos",
            headers=headers,
            params={
                "query": query,
                "per_page": 30,
                "page": page,
                "orientation": "landscape",
                "content_filter": "high",
            },
        )
        response.raise_for_status()
        data = response.json()
    except Exception as exc:
        console.log(f"[red]API error: {exc}[/red]")
        return None

    results = data.get("results", [])
    random.shuffle(results)

    for photo in results:
        photo_id = photo["id"]
        if photo_id not in used_ids:
            url_base = photo["urls"]["regular"].split("?")[0]
            display_url = f"{url_base}?w=1200&q=80&fit=crop"
            photographer = photo["user"]["name"]
            description = (
                photo.get("description")
                or photo.get("alt_description")
                or query.title()
            )
            caption = f"{description.capitalize()} — Photo by {photographer} on Unsplash"
            return display_url, caption, photographer, photo_id

    return None


def _get_article_category(md_file: Path) -> str:
    """Extract category from article frontmatter."""
    try:
        text = md_file.read_text(encoding="utf-8")
        match = re.search(r"^category:\s*(.+)$", text, re.MULTILINE)
        if match:
            return match.group(1).strip().strip("\"'")
    except Exception:
        pass
    return "mercados"


def _replace_image_in_file(
    md_file: Path,
    new_url: str,
    new_caption: str,
    apply: bool,
) -> bool:
    """Replace the image URL and caption in a markdown file."""
    try:
        text = md_file.read_text(encoding="utf-8")
        new_text = re.sub(
            r'^(image:\s*)["\']?https://images\.unsplash\.com/[^"\'\s]+["\']?',
            rf'\g<1>"{new_url}"',
            text,
            count=1,
            flags=re.MULTILINE,
        )
        new_text = re.sub(
            r'^(imageCaption:\s*)["\']?.*["\']?\s*$',
            rf'\g<1>"{new_caption}"',
            new_text,
            count=1,
            flags=re.MULTILINE,
        )

        if apply:
            md_file.write_text(new_text, encoding="utf-8")

            # Also update EN/ES translations if they exist
            for lang in ("en", "es"):
                lang_file = md_file.parent / lang / md_file.name
                if lang_file.exists():
                    lang_text = lang_file.read_text(encoding="utf-8")
                    lang_text = re.sub(
                        r'^(image:\s*)["\']?https://images\.unsplash\.com/[^"\'\s]+["\']?',
                        rf'\g<1>"{new_url}"',
                        lang_text,
                        count=1,
                        flags=re.MULTILINE,
                    )
                    lang_text = re.sub(
                        r'^(imageCaption:\s*)["\']?.*["\']?\s*$',
                        rf'\g<1>"{new_caption}"',
                        lang_text,
                        count=1,
                        flags=re.MULTILINE,
                    )
                    lang_file.write_text(lang_text, encoding="utf-8")

        return True
    except Exception as exc:
        console.log(f"[red]Error updating {md_file.name}: {exc}[/red]")
        return False


def main() -> None:
    parser = argparse.ArgumentParser(description="Fix duplicate article images")
    parser.add_argument("--apply", action="store_true", help="Apply changes (default is dry run)")
    parser.add_argument("--batch", type=int, default=0, help="Max articles to fix per run (0 = all)")
    args = parser.parse_args()

    content_dir = settings.content_output_dir
    console.print(f"[bold]Scanning articles in:[/bold] {content_dir}")

    image_to_files = _scan_articles(content_dir)
    duplicates = _find_duplicates(image_to_files)

    if not duplicates:
        console.print("[green]No duplicate images found![/green]")
        return

    # Count total articles needing fixes (keep 1 per image, fix the rest)
    files_to_fix: list[tuple[Path, str]] = []
    for photo_id, files in duplicates.items():
        # Keep the first file, fix the rest
        for f in files[1:]:
            category = _get_article_category(f)
            files_to_fix.append((f, category))

    console.print(f"[yellow]Found {len(duplicates)} duplicate images across {len(files_to_fix)} articles to fix[/yellow]")

    if args.batch > 0:
        files_to_fix = files_to_fix[: args.batch]
        console.print(f"[dim]Processing batch of {len(files_to_fix)} articles[/dim]")

    # Collect all currently used IDs
    used_ids: set[str] = set(image_to_files.keys())

    headers = {
        "Authorization": f"Client-ID {settings.unsplash_access_key}",
        "Accept-Version": "v1",
    }

    fixed = 0
    failed = 0

    with httpx.Client(timeout=10.0) as client:
        for i, (md_file, category) in enumerate(files_to_fix):
            search_terms = UNSPLASH_SEARCH_TERMS.get(category, ["finance", "business"])
            query = random.choice(search_terms)

            # Try to find a unique image
            result = None
            for page in range(1, 4):
                result = _search_unique_image(client, headers, query, used_ids, page)
                if result:
                    break
                # Try a different term
                query = random.choice(search_terms)

            if result:
                display_url, caption, photographer, photo_id = result
                used_ids.add(photo_id)

                if _replace_image_in_file(md_file, display_url, caption, apply=args.apply):
                    fixed += 1
                    action = "Fixed" if args.apply else "Would fix"
                    console.log(
                        f"[green][{i+1}/{len(files_to_fix)}] {action}:[/green] "
                        f"{md_file.name[:40]} -> {photographer}"
                    )
                else:
                    failed += 1
            else:
                failed += 1
                console.log(f"[red]No unique image found for {md_file.name}[/red]")

            # Respect Unsplash rate limits (50 req/hour for demo apps)
            if (i + 1) % 10 == 0:
                console.log("[dim]Pausing 5s for rate limits...[/dim]")
                time.sleep(5)

    console.print()
    mode = "APPLIED" if args.apply else "DRY RUN"
    console.print(f"[bold]{mode}:[/bold] {fixed} fixed, {failed} failed, {len(files_to_fix)} total")

    if not args.apply and fixed > 0:
        console.print("[yellow]Run with --apply to make changes.[/yellow]")


if __name__ == "__main__":
    main()
