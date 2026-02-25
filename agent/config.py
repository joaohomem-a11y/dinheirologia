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

    # Agent behavior
    max_articles_per_feed: int = Field(default=3, env="MAX_ARTICLES_PER_FEED")
    min_article_length: int = Field(default=300, env="MIN_ARTICLE_LENGTH")
    claude_model: str = Field(default="claude-opus-4-6", env="CLAUDE_MODEL")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    save_raw_articles: bool = Field(default=False, env="SAVE_RAW_ARTICLES")

    model_config = {"env_file": str(_AGENT_DIR / ".env"), "extra": "ignore"}

    @field_validator("content_output_dir", "manual_input_file", "state_file", mode="before")
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
    },
    {
        "name": "CNBC Finance",
        "url": "https://www.cnbc.com/id/10000664/device/rss/rss.html",
        "language": "en",
        "category": "mercados",
    },
    {
        "name": "CNBC Investing",
        "url": "https://www.cnbc.com/id/15839135/device/rss/rss.html",
        "language": "en",
        "category": "investimentos",
    },
    {
        "name": "CNBC Business",
        "url": "https://www.cnbc.com/id/10001147/device/rss/rss.html",
        "language": "en",
        "category": "negocios",
    },
    {
        "name": "Google News Business",
        "url": "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB",
        "language": "en",
        "category": "negocios",
    },
    {
        "name": "Google News Economy",
        "url": "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB",
        "language": "en",
        "category": "mercados",
    },
]

# ---------------------------------------------------------------------------
# Fictional authors for agent-generated content
# ---------------------------------------------------------------------------

FICTIONAL_AUTHORS: Final[list[str]] = [
    "Seu Zé das Couve",
    "Creuza",
    "Gertrudes",
    "Tião",
    "Dona Clotilde",
    "Zé Mané",
    "Toninho Maluco",
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
