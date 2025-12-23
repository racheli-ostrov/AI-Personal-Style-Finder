"""
Shopping recommendations controller
"""
from flask import jsonify, request
from services.shopping_service import shopping_service

def get_shopping_recommendations():
    """
    Generate shopping recommendations for a clothing item
    
    POST /api/shopping/recommendations
    Body: {
        "analysis": {
            "type": "shirt",
            "style": "casual",
            "colors": ["blue", "white"],
            "fabric": "cotton"
        }
    }
    
    Returns: {
        "success": true,
        "search_query": "casual blue cotton shirt",
        "recommendations": [
            {
                "store": "Amazon",
                "emoji": "📦",
                "url": "https://...",
                "query": "..."
            }
        ]
    }
    """
    try:
        data = request.json
        
        if not data or 'analysis' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing analysis data'
            }), 400
        
        analysis = data['analysis']
        
        # Generate search query and links
        search_query = shopping_service.generate_search_query(analysis)
        shopping_links = shopping_service.generate_shopping_links(analysis)
        
        return jsonify({
            'success': True,
            'search_query': search_query,
            'recommendations': shopping_links
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
