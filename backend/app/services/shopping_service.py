import urllib.parse
import json


class ShoppingService:
    def _ensure_analysis(self, analysis):
        if isinstance(analysis, str):
            try:
                return json.loads(analysis)
            except Exception:
                return {"type": analysis}
        return analysis or {}

    def generate_search_query(self, analysis: dict) -> str:
        analysis = self._ensure_analysis(analysis)
        parts = []

        if analysis.get("type"):
            parts.append(analysis["type"])
        if analysis.get("style"):
            parts.append(analysis["style"])
        if analysis.get("colors") and isinstance(analysis.get("colors"), (list, tuple)):
            parts.append(analysis["colors"][0])
        if analysis.get("fabric"):
            parts.append(analysis["fabric"])

        return " ".join(parts)

    def generate_shopping_links(self, analysis: dict):
        analysis = self._ensure_analysis(analysis)
        query = self.generate_search_query(analysis)
        if not query:
            return []

        encoded = urllib.parse.quote(query)

        return [
            {
                "store": "Amazon",
                "emoji": "📦",
                "url": f"https://www.amazon.com/s?k={encoded}",
                "query": query
            },
            {
                "store": "Zara",
                "emoji": "👗",
                "url": f"https://www.zara.com/search?searchTerm={encoded}",
                "query": query
            },
            {
                "store": "H&M",
                "emoji": "🛍️",
                "url": f"https://www2.hm.com/en_us/search-results.html?q={encoded}",
                "query": query
            },
            {
                "store": "ASOS",
                "emoji": "✨",
                "url": f"https://www.asos.com/search/?q={encoded}",
                "query": query
            },
            {
                "store": "Target",
                "emoji": "🎯",
                "url": f"https://www.target.com/s?searchTerm={encoded}",
                "query": query
            }
        ]


shopping_service = ShoppingService()
