"""
Configuration module for the Dinheirologia content agent.

Loads settings from environment variables (via .env file) and exposes
typed configuration objects used throughout the agent pipeline.
"""

from __future__ import annotations

from pathlib import Path
from typing import Final

from dotenv import load_dotenv
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings

# Load .env from the agent directory
_AGENT_DIR = Path(__file__).parent
load_dotenv(_AGENT_DIR / ".env")


class Settings(BaseSettings):
    """Typed settings loaded from environment variables."""

    # API keys
    anthropic_api_key: str = Field(..., env="ANTHROPIC_API_KEY")
    unsplash_access_key: str = Field(..., env="UNSPLASH_ACCESS_KEY")

    # Paths
    content_output_dir: Path = Field(
        default=_AGENT_DIR.parent / "site" / "src" / "content" / "artigos",
        env="CONTENT_OUTPUT_DIR",
    )
    manual_input_file: Path = Field(
        default=_AGENT_DIR / "manual_input.json",
        env="MANUAL_INPUT_FILE",
    )
    state_file: Path = Field(
        default=_AGENT_DIR / "agent_state.json",
        env="STATE_FILE",
    )
    drop_folder_dir: Path = Field(
        default=_AGENT_DIR / "drop_articles",
        env="DROP_FOLDER_DIR",
    )

    # Agent behavior
    max_articles_per_feed: int = Field(default=3, env="MAX_ARTICLES_PER_FEED")
    min_article_length: int = Field(default=300, env="MIN_ARTICLE_LENGTH")
    claude_model: str = Field(default="claude-opus-4-6", env="CLAUDE_MODEL")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    save_raw_articles: bool = Field(default=False, env="SAVE_RAW_ARTICLES")

    # Authenticated source credentials
    ft_email: str = Field(default="", env="FT_EMAIL")
    ft_password: str = Field(default="", env="FT_PASSWORD")
    gavekal_email: str = Field(default="", env="GAVEKAL_EMAIL")
    gavekal_password: str = Field(default="", env="GAVEKAL_PASSWORD")

    model_config = {"env_file": str(_AGENT_DIR / ".env"), "extra": "ignore"}

    @field_validator("content_output_dir", "manual_input_file", "state_file", "drop_folder_dir", mode="before")
    @classmethod
    def resolve_path(cls, v: str | Path) -> Path:
        """Resolve relative paths against the agent directory."""
        p = Path(v)
        if not p.is_absolute():
            return (_AGENT_DIR / p).resolve()
        return p.resolve()


# ---------------------------------------------------------------------------
# RSS Feed sources
# ---------------------------------------------------------------------------

RSS_FEEDS: Final[list[dict[str, str]]] = [
    # --- Working feeds (tested 2026-02-25) ---
    {
        "name": "Yahoo Finance",
        "url": "https://finance.yahoo.com/rss/",
        "language": "en",
        "category": "investimentos",
        "content_type": "noticia",
    },
    {
        "name": "CNBC Finance",
        "url": "https://www.cnbc.com/id/10000664/device/rss/rss.html",
        "language": "en",
        "category": "mercados",
        "content_type": "noticia",
    },
    {
        "name": "CNBC Investing",
        "url": "https://www.cnbc.com/id/15839135/device/rss/rss.html",
        "language": "en",
        "category": "investimentos",
        "content_type": "noticia",
    },
    {
        "name": "CNBC Business",
        "url": "https://www.cnbc.com/id/10001147/device/rss/rss.html",
        "language": "en",
        "category": "negocios",
        "content_type": "noticia",
    },
    {
        "name": "Google News Business",
        "url": "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB",
        "language": "en",
        "category": "negocios",
        "content_type": "noticia",
    },
    {
        "name": "Google News Economy",
        "url": "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB",
        "language": "en",
        "category": "mercados",
        "content_type": "noticia",
    },
    # --- Seeking Alpha ---
    {
        "name": "Seeking Alpha",
        "url": "https://seekingalpha.com/feed.xml",
        "language": "en",
        "category": "investimentos",
        "content_type": "noticia",
    },
    {
        "name": "Seeking Alpha Analysis",
        "url": "https://seekingalpha.com/feed/tag/long-ideas",
        "language": "en",
        "category": "investimentos",
        "content_type": "artigo",
    },
    # --- Investopedia ---
    {
        "name": "Investopedia News",
        "url": "https://www.investopedia.com/feedbuilder/feed/getfeed/?feedName=rss_headline",
        "language": "en",
        "category": "mercados",
        "content_type": "noticia",
    },
    {
        "name": "Investopedia Education",
        "url": "https://www.investopedia.com/feedbuilder/feed/getfeed/?feedName=rss_articles",
        "language": "en",
        "category": "investimentos",
        "content_type": "artigo",
    },
]

# ---------------------------------------------------------------------------
# Authenticated sources (require login credentials)
# ---------------------------------------------------------------------------

AUTHENTICATED_SOURCES: Final[list[dict[str, str | int]]] = [
    {
        "name": "Financial Times",
        "base_url": "https://www.ft.com",
        "category": "mercados",
        "content_type": "artigo",
        "max_articles": 3,
    },
    {
        "name": "Gavekal Research",
        "base_url": "https://research.gavekal.com",
        "category": "mercados",
        "content_type": "artigo",
        "max_articles": 2,
    },
]

# ---------------------------------------------------------------------------
# Fictional authors for agent-generated content
# ---------------------------------------------------------------------------

FICTIONAL_AUTHORS: Final[list[str]] = [
    "Seu Zé das Couve Flambado",
    "Creuza Maravilha",
    "Gertrudes Von Boleto",
    "Tião Poupança",
    "Dona Clotilde Dividendo",
    "Zé Mané Alavancado",
    "Toninho Maluco das Opções",
    "Jurema Short-Squeeze",
    "Beto Calote Neto",
    "Marlene Fibonacci",
]

# The site owner's byline — always used for manually-fed content
OWNER_AUTHOR: Final[str] = (
    "Como Dirigir Uma Mercearia e Umas Coisinhas Que Aprendi Sobre Pescaria"
)

# ---------------------------------------------------------------------------
# Content categories
# ---------------------------------------------------------------------------

VALID_CATEGORIES: Final[list[str]] = [
    "mercados",
    "trading",
    "investimentos",
    "negocios",
    "opiniao",
]

# ---------------------------------------------------------------------------
# Unsplash search terms mapped to category
# ---------------------------------------------------------------------------

UNSPLASH_SEARCH_TERMS: Final[dict[str, list[str]]] = {
    "mercados": ["stock market", "trading floor", "finance", "wall street"],
    "trading": ["trading", "charts", "candlestick", "stock charts"],
    "investimentos": ["investment", "money", "wealth", "growth"],
    "negocios": ["business", "entrepreneurship", "office", "deal"],
    "opiniao": ["thinking", "analysis", "strategy", "chess"],
}

# ---------------------------------------------------------------------------
# Singleton settings instance
# ---------------------------------------------------------------------------

settings = Settings()
