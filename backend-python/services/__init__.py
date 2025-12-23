"""Top-level services package shim for tests.

This package re-exports the implementations under `app.services` so older
tests that import `services.*` continue to work.
"""

from . import wardrobe_service, style_analysis_service, shopping_service, gemini_service

__all__ = [
    "wardrobe_service",
    "style_analysis_service",
    "shopping_service",
    "gemini_service",
]
