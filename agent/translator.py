"""
Translation module for the Dinheirologia content agent.

Translates Portuguese articles to English and Spanish using Claude.
Preserves the voice, tone, and Markdown formatting of the original.
"""

from __future__ import annotations

from dataclasses import dataclass

import anthropic
from rich.console import Console
from tenacity import retry, stop_after_attempt, wait_exponential

from config import settings

console = Console()

# ---------------------------------------------------------------------------
# Translation prompts
# ---------------------------------------------------------------------------

_TRANSLATION_SYSTEM = """\
You are a professional financial content translator specializing in Brazilian Portuguese,
English, and Spanish. You translate articles while:

1. Preserving the author's unique voice: sharp, street-smart, anti-establishment,
   with acid humor and pop culture references.
2. Keeping all Markdown formatting intact (headers, bold, italics, lists).
3. Adapting idioms naturally — never doing literal translations of Brazilian slang.
4. Preserving any mild profanity at the same intensity level in the target language.
5. Keeping financial terms accurate but explained in plain language as the original does.
6. For English: use American English with a punchy, direct tone.
7. For Spanish: use neutral Latin American Spanish, not Castilian.

Return ONLY the translated content. No explanations, no notes, no preamble.
"""

_TRANSLATION_USER = """\
Translate the following Brazilian Portuguese financial article to {target_language}.

TITLE: {title}
SUBTITLE: {subtitle}

BODY:
{body}

---
Return in this exact format:
TITULO_TRADUZIDO: <translated title>
SUBTITULO_TRADUZIDO: <translated subtitle, or "none" if empty>
<translated body in Markdown>
"""


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------


@dataclass
class TranslatedContent:
    """Holds translated versions of an article."""

    title: str
    subtitle: str
    body: str
    language: str  # "en" or "es"


# ---------------------------------------------------------------------------
# Translator
# ---------------------------------------------------------------------------


class ArticleTranslator:
    """
    Translates rewritten Portuguese articles to English and Spanish.

    Args:
        client: An initialized anthropic.Anthropic client.
    """

    def __init__(self, client: anthropic.Anthropic) -> None:
        self._client = client

    def translate_both(
        self,
        title_pt: str,
        subtitle_pt: str,
        body_pt: str,
    ) -> dict[str, TranslatedContent]:
        """
        Translate an article to both English and Spanish.

        Args:
            title_pt: Portuguese title.
            subtitle_pt: Portuguese subtitle (may be empty).
            body_pt: Portuguese article body in Markdown.

        Returns:
            Dict with keys "en" and "es" mapping to TranslatedContent.
        """
        translations: dict[str, TranslatedContent] = {}

        for lang_code, lang_name in [("en", "English"), ("es", "Spanish (Latin American)")]:
            try:
                translated = self._translate(
                    title=title_pt,
                    subtitle=subtitle_pt,
                    body=body_pt,
                    target_language=lang_name,
                    lang_code=lang_code,
                )
                translations[lang_code] = translated
                console.log(f"[green]Translated to {lang_code}:[/green] {translated.title[:60]}")
            except Exception as exc:
                console.log(f"[red]Translation to {lang_code} failed: {exc}[/red]")
                # Fallback: use Portuguese content so publishing still proceeds
                translations[lang_code] = TranslatedContent(
                    title=title_pt,
                    subtitle=subtitle_pt,
                    body=body_pt,
                    language=lang_code,
                )

        return translations

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=2, min=4, max=30),
        reraise=True,
    )
    def _translate(
        self,
        title: str,
        subtitle: str,
        body: str,
        target_language: str,
        lang_code: str,
    ) -> TranslatedContent:
        """
        Call Claude to translate a single article to the target language.

        Args:
            title: Article title in Portuguese.
            subtitle: Article subtitle in Portuguese (may be empty).
            body: Article body in Markdown.
            target_language: Human-readable target language name.
            lang_code: ISO 639-1 code ("en" or "es").

        Returns:
            TranslatedContent with the translated title, subtitle, and body.
        """
        prompt = _TRANSLATION_USER.format(
            target_language=target_language,
            title=title,
            subtitle=subtitle or "(no subtitle)",
            body=body[:5000],
        )

        message = self._client.messages.create(
            model=settings.claude_model,
            max_tokens=2048,
            system=_TRANSLATION_SYSTEM,
            messages=[{"role": "user", "content": prompt}],
        )

        raw = message.content[0].text.strip()
        return self._parse_translation(raw, lang_code, title, subtitle)

    @staticmethod
    def _parse_translation(
        raw: str,
        lang_code: str,
        fallback_title: str,
        fallback_subtitle: str,
    ) -> TranslatedContent:
        """
        Parse the structured translation output from Claude.

        Args:
            raw: Raw text output from Claude.
            lang_code: Language code for the translation.
            fallback_title: Original title to use if parsing fails.
            fallback_subtitle: Original subtitle to use if parsing fails.

        Returns:
            Parsed TranslatedContent.
        """
        lines = raw.splitlines()
        title = fallback_title
        subtitle = fallback_subtitle
        body_lines: list[str] = []
        in_body = False

        for line in lines:
            stripped = line.strip()

            if stripped.upper().startswith("TITULO_TRADUZIDO:"):
                title = stripped.split(":", 1)[1].strip().strip('"')
                continue

            if stripped.upper().startswith("SUBTITULO_TRADUZIDO:"):
                raw_sub = stripped.split(":", 1)[1].strip()
                subtitle = "" if raw_sub.lower() in ("none", "nenhum", "(no subtitle)") else raw_sub.strip('"')
                in_body = True
                continue

            if in_body:
                body_lines.append(line)

        body = "\n".join(body_lines).strip()

        # Fallback if parsing completely failed
        if not body:
            body = raw

        return TranslatedContent(
            title=title,
            subtitle=subtitle,
            body=body,
            language=lang_code,
        )
