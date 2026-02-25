"""
Main entry point for the Dinheirologia content agent.

Orchestrates the full pipeline:
  1. Load manual articles from manual_input.json
  2. Fetch new articles from RSS feeds
  3. Rewrite each article in the Dinheirologia voice using Claude
  4. Translate to English and Spanish
  5. Source a header image from Unsplash
  6. Publish markdown files to the Next.js content directory
  7. Persist state (processed URLs, manual article flags)

Usage:
    python main.py                  # Run full pipeline
    python main.py --manual-only    # Process only manual input articles
    python main.py --rss-only       # Process only RSS feed articles
    python main.py --init           # Create example manual_input.json and exit
    python main.py --dry-run        # Fetch and rewrite but do not write files
"""

from __future__ import annotations

import argparse
import logging
import sys
from datetime import datetime, timezone

import anthropic
from rich.console import Console
from rich.logging import RichHandler
from rich.panel import Panel
from rich.table import Table

from config import settings
from fetcher import FeedFetcher, ProcessedURLStore, RawArticle
from image_sourcer import ImageSourcer
from manual_input import ManualArticle, ManualInputProcessor
from publisher import ArticlePublisher, PublishResult
from rewriter import ArticleRewriter, RewrittenArticle
from translator import ArticleTranslator

# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=getattr(logging, settings.log_level, logging.INFO),
    format="%(message)s",
    handlers=[RichHandler(rich_tracebacks=True, show_path=False)],
)
log = logging.getLogger("dinheirologia.agent")
console = Console()


# ---------------------------------------------------------------------------
# Pipeline helpers
# ---------------------------------------------------------------------------


def _process_rss_article(
    raw: RawArticle,
    rewriter: ArticleRewriter,
    translator: ArticleTranslator,
    image_sourcer: ImageSourcer,
    publisher: ArticlePublisher,
    dry_run: bool,
) -> PublishResult | None:
    """
    Run the full pipeline for a single RSS-fetched article.

    Args:
        raw: The raw article from the RSS feed.
        rewriter: Claude-powered article rewriter.
        translator: Claude-powered translator.
        image_sourcer: Unsplash image fetcher.
        publisher: Markdown file writer.
        dry_run: If True, skip writing files to disk.

    Returns:
        PublishResult if the article was published, None on failure.
    """
    try:
        # Step 1: Rewrite
        rewritten = rewriter.rewrite(raw, is_manual=False)

        # Step 2: Translate
        translations = translator.translate_both(
            title_pt=rewritten.title_pt,
            subtitle_pt=rewritten.subtitle_pt,
            body_pt=rewritten.body_pt,
        )

        # Step 3: Source image
        image = image_sourcer.get_image(rewritten.category, rewritten.tags)

        # Step 4: Publish
        if dry_run:
            console.log(f"[dim][dry-run] Would publish: {rewritten.title_pt[:60]}[/dim]")
            # Return a sentinel so dry-run isn't counted as an error
            return PublishResult(
                slug="dry-run", title_pt=rewritten.title_pt, paths={}
            )

        result = publisher.publish(
            article=rewritten,
            translations=translations,
            image=image,
            featured=False,
            content_type="noticia",
        )
        return result

    except Exception as exc:
        log.error(f"Failed to process RSS article '{raw.title[:60]}': {exc}", exc_info=True)
        return None


def _process_manual_article(
    manual: ManualArticle,
    rewriter: ArticleRewriter,
    translator: ArticleTranslator,
    image_sourcer: ImageSourcer,
    publisher: ArticlePublisher,
    manual_processor: ManualInputProcessor,
    dry_run: bool,
) -> PublishResult | None:
    """
    Run the full pipeline for a manually-submitted article.

    Manual articles skip the rewriter's voice transformation — the owner's
    text is used as-is for the Portuguese version, but Claude still translates
    it to EN/ES while preserving the author's voice.

    Args:
        manual: The manually-submitted article.
        rewriter: Used here only to build a RewrittenArticle from manual content.
        translator: Claude-powered translator.
        image_sourcer: Unsplash image fetcher.
        publisher: Markdown file writer.
        manual_processor: Used to mark article as processed after publishing.
        dry_run: If True, skip writing files to disk.

    Returns:
        PublishResult if the article was published, None on failure.
    """
    try:
        # Manual articles use the owner's text directly — no rewriting.
        # We still construct a RewrittenArticle to feed into the standard pipeline.
        rewritten = RewrittenArticle(
            title_pt=manual.title,
            subtitle_pt="",
            body_pt=manual.body,
            tags=manual.tags or ["mercado financeiro", "investimentos"],
            category=manual.category,
            author=manual.author,
            source_url=f"manual://{manual.id}",
            source_name="Manual Input",
            published_at=manual.published_at,
            url_hash=manual.url_hash,
        )

        # Translate if requested
        translations: dict = {}
        if manual.translate:
            translations = translator.translate_both(
                title_pt=rewritten.title_pt,
                subtitle_pt=rewritten.subtitle_pt,
                body_pt=rewritten.body_pt,
            )

        # Source image
        image = image_sourcer.get_image(manual.category, manual.tags)

        # Publish
        if dry_run:
            console.log(
                f"[dim][dry-run] Would publish manual article: {manual.title[:60]}[/dim]"
            )
            return PublishResult(
                slug="dry-run", title_pt=manual.title, paths={}
            )

        result = publisher.publish(
            article=rewritten,
            translations=translations,
            image=image,
            featured=manual.featured,
            content_type="artigo",
        )

        # Mark as processed so it won't run again
        manual_processor.mark_processed(manual.id)
        return result

    except Exception as exc:
        log.error(
            f"Failed to process manual article '{manual.title[:60]}': {exc}",
            exc_info=True,
        )
        return None


# ---------------------------------------------------------------------------
# Summary table
# ---------------------------------------------------------------------------


def _print_summary(results: list[PublishResult], elapsed_seconds: float) -> None:
    """Print a Rich summary table of published articles."""
    table = Table(title="Published Articles", show_header=True, header_style="bold cyan")
    table.add_column("Slug", style="dim", max_width=45)
    table.add_column("Title", max_width=50)
    table.add_column("Langs", justify="center")

    for r in results:
        langs = "/".join(sorted(r.paths.keys()))
        table.add_row(r.slug, r.title_pt[:50], langs)

    console.print(table)
    console.print(
        f"[bold green]{len(results)} article(s) published[/bold green] "
        f"in {elapsed_seconds:.1f}s"
    )


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------


def run(
    manual_only: bool = False,
    rss_only: bool = False,
    dry_run: bool = False,
) -> int:
    """
    Execute the full content agent pipeline.

    Args:
        manual_only: Process only manual input articles.
        rss_only: Process only RSS feed articles.
        dry_run: Fetch and rewrite but do not write any files.

    Returns:
        Exit code (0 = success, 1 = partial failure, 2 = total failure).
    """
    start_time = datetime.now(tz=timezone.utc)

    console.print(
        Panel.fit(
            "[bold cyan]Dinheirologia Content Agent[/bold cyan]\n"
            f"[dim]{start_time.strftime('%Y-%m-%d %H:%M UTC')}[/dim]",
            border_style="cyan",
        )
    )

    # --- Initialize components ---
    try:
        claude_client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    except Exception as exc:
        log.error(f"Failed to initialize Anthropic client: {exc}")
        return 2

    store = ProcessedURLStore(settings.state_file)
    rewriter = ArticleRewriter(claude_client)
    translator = ArticleTranslator(claude_client)
    image_sourcer = ImageSourcer(settings.unsplash_access_key)
    publisher = ArticlePublisher(settings.content_output_dir)
    manual_processor = ManualInputProcessor(settings.manual_input_file)

    results: list[PublishResult] = []
    errors = 0

    # -----------------------------------------------------------------------
    # Manual articles
    # -----------------------------------------------------------------------
    if not rss_only:
        manual_articles = manual_processor.load_pending()
        for manual in manual_articles:
            console.rule(f"[bold]Manual: {manual.title[:50]}[/bold]")
            result = _process_manual_article(
                manual=manual,
                rewriter=rewriter,
                translator=translator,
                image_sourcer=image_sourcer,
                publisher=publisher,
                manual_processor=manual_processor,
                dry_run=dry_run,
            )
            if result:
                results.append(result)
            else:
                errors += 1

    # -----------------------------------------------------------------------
    # RSS articles
    # -----------------------------------------------------------------------
    if not manual_only:
        fetcher = FeedFetcher(store)
        rss_articles = fetcher.fetch_all()
        console.log(f"[blue]Total new RSS articles:[/blue] {len(rss_articles)}")

        for raw in rss_articles:
            console.rule(f"[bold]RSS: {raw.title[:50]}[/bold]")
            result = _process_rss_article(
                raw=raw,
                rewriter=rewriter,
                translator=translator,
                image_sourcer=image_sourcer,
                publisher=publisher,
                dry_run=dry_run,
            )
            if result:
                results.append(result)
            else:
                errors += 1

        # Persist the updated URL state
        if not dry_run:
            store.save()

    # -----------------------------------------------------------------------
    # Summary
    # -----------------------------------------------------------------------
    elapsed = (datetime.now(tz=timezone.utc) - start_time).total_seconds()
    _print_summary(results, elapsed)

    if errors > 0:
        console.log(f"[yellow]{errors} article(s) failed to process.[/yellow]")
        return 1 if results else 2

    return 0


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------


def main() -> None:
    """Parse CLI arguments and run the agent pipeline."""
    parser = argparse.ArgumentParser(
        description="Dinheirologia content agent — fetches, rewrites, and publishes financial articles.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--manual-only",
        action="store_true",
        help="Process only articles from manual_input.json",
    )
    parser.add_argument(
        "--rss-only",
        action="store_true",
        help="Process only RSS feed articles",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Fetch and rewrite but do not write markdown files",
    )
    parser.add_argument(
        "--init",
        action="store_true",
        help="Create an example manual_input.json and exit",
    )

    args = parser.parse_args()

    if args.manual_only and args.rss_only:
        console.print("[red]Cannot use --manual-only and --rss-only together.[/red]")
        sys.exit(1)

    if args.init:
        ManualInputProcessor.create_example(settings.manual_input_file)
        console.print(f"[green]Example file created at:[/green] {settings.manual_input_file}")
        sys.exit(0)

    exit_code = run(
        manual_only=args.manual_only,
        rss_only=args.rss_only,
        dry_run=args.dry_run,
    )
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
