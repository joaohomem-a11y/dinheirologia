"""
Article rewriter using the Anthropic Claude API.

Takes a raw article and rewrites it in the Dinheirologia voice:
casca grossa, humor acido, anti-establishment, Taleb-inspired,
with movie/pop culture metaphors and plain-language financial explanations.
"""

from __future__ import annotations

import random
from dataclasses import dataclass

import anthropic
from rich.console import Console
from tenacity import retry, stop_after_attempt, wait_exponential

from config import FICTIONAL_AUTHORS, OWNER_AUTHOR, settings
from fetcher import RawArticle

console = Console()

# ---------------------------------------------------------------------------
# Voice prompt — the soul of the agent
# ---------------------------------------------------------------------------

_VOICE_SYSTEM_PROMPT = """\
Voce e um escritor financeiro brasileiro com personalidade unica. Seu estilo e:

PERSONALIDADE:
- Casca grossa, dureza de rua, direto ao ponto sem papas na lingua
- Humor acido e ironia afiada contra o "circo" do mercado financeiro mainstream
- Anti-establishment: desconfia de grandes instituicoes, analistas de terno e gurus das redes sociais
- Inspirado na filosofia de Nassim Taleb: quem nao tem "skin in the game" nao tem moral pra falar
- Pro-mercado, pro-meritocracia, pro-familia, valores conservadores
- Visao crista da vida e dos negocios (sem ser pregador chato)
- Anti-fake gurus, anti-circo financeiro, anti-narrativa vazia

ESTILO DE ESCRITA:
- Usa metaforas de filmes e cultura pop (Coringa, Batman, Breaking Bad, Matrix, etc.)
- Explica o "economês" (jargao financeiro) em linguagem simples e com humor
- Palavrao leve ocasional em portugues quando faz sentido (porra, merda, foda-se o circo)
- Analise profunda, nao superficial. Vai alem da manchete
- Usa exemplos historicos reais: Buffett, Taleb, Graham, Kovner, Thorp, grandes traders
- Perguntas provocativas ao leitor no final
- Tom de carta pessoal, nao de artigo corporativo
- Paragrafos curtos. Ritmo rapido
- Nunca soar como IA ou como redator de assessoria de imprensa

ESTRUTURA DOS ARTIGOS:
1. Abertura impactante (citacao, anedota, paradoxo ou soco na cara)
2. Desenvolvimento com analogia cultural/historica
3. Analise real do fato financeiro sem dourar a pilula
4. Conclusao provocativa que questiona o leitor
5. Sem resumo bobo. Sem "em conclusao". Termina com uma porrada.

IDIOMA: Sempre em Portugues do Brasil.
OUTPUT: Apenas o corpo do artigo em Markdown. Sem frontmatter. Sem titulo H1 no inicio (o titulo vai no frontmatter).
"""

_REWRITE_USER_TEMPLATE = """\
Reescreva o artigo abaixo no estilo descrito. O artigo original e em {language} — traduza e reescreva ao mesmo tempo para Portugues do Brasil.

TITULO ORIGINAL: {title}

FONTE: {source_name}

CONTEUDO ORIGINAL:
{body}

---
INSTRUCOES ADICIONAIS:
- Categoria do artigo: {category}
- Crie um titulo em portugues mais provocativo e direto (retorne como primeira linha no formato: TITULO: <titulo aqui>)
- Crie um subtitulo opcional (retorne como segunda linha no formato: SUBTITULO: <subtitulo aqui> — ou SUBTITULO: nenhum)
- Depois do subtitulo, escreva o corpo do artigo em Markdown
- Minimo 400 palavras, maximo 900 palavras
- Escolha 3 a 5 tags relevantes em portugues (retorne ao final no formato: TAGS: tag1, tag2, tag3)
- Escolha a categoria mais adequada dentre: mercados, trading, investimentos, negocios, opiniao
  (retorne ao final no formato: CATEGORIA: categoria)
"""


# ---------------------------------------------------------------------------
# Data model for rewritten content
# ---------------------------------------------------------------------------


@dataclass
class RewrittenArticle:
    """A fully rewritten article ready for translation and publishing."""

    title_pt: str
    subtitle_pt: str
    body_pt: str
    tags: list[str]
    category: str
    author: str
    source_url: str
    source_name: str
    published_at: str  # ISO date string
    url_hash: str


# ---------------------------------------------------------------------------
# Author selection
# ---------------------------------------------------------------------------


def pick_author(is_manual: bool = False) -> str:
    """
    Return the appropriate author name.

    Manual articles always use the owner's byline.
    Agent-generated articles get a random fictional author.
    """
    if is_manual:
        return OWNER_AUTHOR
    return random.choice(FICTIONAL_AUTHORS)


# ---------------------------------------------------------------------------
# Claude API rewriter
# ---------------------------------------------------------------------------


class ArticleRewriter:
    """
    Rewrites raw articles using the Claude API.

    Args:
        client: An initialized anthropic.Anthropic client.
    """

    def __init__(self, client: anthropic.Anthropic) -> None:
        self._client = client

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=2, min=4, max=30),
        reraise=True,
    )
    def rewrite(self, article: RawArticle, is_manual: bool = False) -> RewrittenArticle:
        """
        Rewrite a single article in the Dinheirologia voice.

        Args:
            article: The raw article to rewrite.
            is_manual: If True, uses the owner's byline instead of a fictional author.

        Returns:
            A RewrittenArticle with Portuguese content.

        Raises:
            anthropic.APIError: On API failures after retries are exhausted.
        """
        console.log(f"[cyan]Rewriting:[/cyan] {article.title[:70]}")

        prompt = _REWRITE_USER_TEMPLATE.format(
            language="inglês" if article.language == "en" else "português",
            title=article.title,
            source_name=article.source_name,
            body=article.body[:6000],  # Respect context limits
            category=article.category,
        )

        message = self._client.messages.create(
            model=settings.claude_model,
            max_tokens=2048,
            system=_VOICE_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}],
        )

        raw_output = message.content[0].text.strip()
        return self._parse_output(raw_output, article, is_manual)

    def _parse_output(
        self,
        raw_output: str,
        original: RawArticle,
        is_manual: bool,
    ) -> RewrittenArticle:
        """
        Parse the structured output from Claude into a RewrittenArticle.

        Expected format:
            TITULO: <title>
            SUBTITULO: <subtitle or "nenhum">
            <body markdown>
            TAGS: tag1, tag2, tag3
            CATEGORIA: categoria
        """
        lines = raw_output.splitlines()
        title_pt = original.title
        subtitle_pt = ""
        tags: list[str] = []
        category = original.category
        body_lines: list[str] = []
        in_body = False

        for i, line in enumerate(lines):
            stripped = line.strip()

            if stripped.upper().startswith("TITULO:"):
                title_pt = stripped.split(":", 1)[1].strip().strip('"')
                continue

            if stripped.upper().startswith("SUBTITULO:"):
                raw_sub = stripped.split(":", 1)[1].strip()
                subtitle_pt = "" if raw_sub.lower() == "nenhum" else raw_sub.strip('"')
                in_body = True
                continue

            if stripped.upper().startswith("TAGS:"):
                raw_tags = stripped.split(":", 1)[1].strip()
                tags = [t.strip() for t in raw_tags.split(",") if t.strip()]
                continue

            if stripped.upper().startswith("CATEGORIA:"):
                category = stripped.split(":", 1)[1].strip().lower()
                continue

            if in_body:
                body_lines.append(line)

        body_pt = "\n".join(body_lines).strip()

        # Fallback: if parsing failed, use the full output as body
        if not body_pt:
            body_pt = raw_output

        # Ensure we have at least some tags
        if not tags:
            tags = [original.category, "mercado financeiro", "investimentos"]

        return RewrittenArticle(
            title_pt=title_pt,
            subtitle_pt=subtitle_pt,
            body_pt=body_pt,
            tags=tags,
            category=category,
            author=pick_author(is_manual),
            source_url=original.url,
            source_name=original.source_name,
            published_at=original.published_at.strftime("%Y-%m-%d"),
            url_hash=original.url_hash,
        )
