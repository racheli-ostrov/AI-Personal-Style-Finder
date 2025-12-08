"""
Shopping Recommendations Service
Generates shopping links based on clothing analysis
"""
import urllib.parse
from typing import Dict, List, Any

class ShoppingService:
    """Service for generating shopping recommendations"""
    
    def __init__(self):
        """Initialize shopping service with store configurations"""
        self.stores = {
            'amazon': {
                'name': 'Amazon',
                'base_url': 'https://www.amazon.com/s',
                'emoji': '📦'
            },
            'zara': {
                'name': 'Zara',
                'base_url': 'https://www.zara.com/search',
                'emoji': '👗'
            },
            'hm': {
                'name': 'H&M',
                'base_url': 'https://www2.hm.com/en_us/search-results.html',
                'emoji': '🛍️'
            },
            'asos': {
                'name': 'ASOS',
                'base_url': 'https://www.asos.com/search/',
                'emoji': '✨'
            },
            'target': {
                'name': 'Target',
                'base_url': 'https://www.target.com/s',
                'emoji': '🎯'
            }
        }
    
    def generate_search_query(self, analysis: Dict[str, Any]) -> str:
        """
        Generate search query from clothing analysis
        
        Args:
            analysis: Clothing analysis data
            
        Returns:
            Search query string
        """
        query_parts = []
        
        # Add type
        clothing_type = analysis.get('type') or analysis.get('clothing_type') or analysis.get('itemType', '')
        if clothing_type:
            query_parts.append(clothing_type)
        
        # Add style
        style = analysis.get('style', '')
        if style and style.lower() not in ['unknown', 'none']:
            query_parts.append(style)
        
        # Add primary color
        colors = analysis.get('colors', [])
        if colors and len(colors) > 0:
            query_parts.append(colors[0])
        
        # Add fabric if available
        fabric = analysis.get('fabric', '')
        if fabric and fabric.lower() not in ['unknown', 'none', 'mixed']:
            query_parts.append(fabric)
        
        return ' '.join(query_parts)
    
    def generate_shopping_links(self, analysis: Dict[str, Any]) -> List[Dict[str, str]]:
        """
        Generate shopping links for similar items
        
        Args:
            analysis: Clothing analysis data
            
        Returns:
            List of shopping links with store info
        """
        search_query = self.generate_search_query(analysis)
        
        if not search_query:
            return []
        
        links = []
        
        # Amazon
        amazon_params = {'k': search_query}
        links.append({
            'store': self.stores['amazon']['name'],
            'emoji': self.stores['amazon']['emoji'],
            'url': f"{self.stores['amazon']['base_url']}?{urllib.parse.urlencode(amazon_params)}",
            'query': search_query
        })
        
        # H&M
        hm_params = {'q': search_query}
        links.append({
            'store': self.stores['hm']['name'],
            'emoji': self.stores['hm']['emoji'],
            'url': f"{self.stores['hm']['base_url']}?{urllib.parse.urlencode(hm_params)}",
            'query': search_query
        })
        
        # ASOS
        asos_query = urllib.parse.quote(search_query)
        links.append({
            'store': self.stores['asos']['name'],
            'emoji': self.stores['asos']['emoji'],
            'url': f"{self.stores['asos']['base_url']}?q={asos_query}",
            'query': search_query
        })
        
        # Target
        target_params = {'searchTerm': search_query}
        links.append({
            'store': self.stores['target']['name'],
            'emoji': self.stores['target']['emoji'],
            'url': f"{self.stores['target']['base_url']}?{urllib.parse.urlencode(target_params)}",
            'query': search_query
        })
        
        # Zara (simpler URL structure)
        zara_query = urllib.parse.quote(search_query)
        links.append({
            'store': self.stores['zara']['name'],
            'emoji': self.stores['zara']['emoji'],
            'url': f"{self.stores['zara']['base_url']}?searchTerm={zara_query}",
            'query': search_query
        })
        
        return links

# Create singleton instance
shopping_service = ShoppingService()
