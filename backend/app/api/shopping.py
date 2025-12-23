from flask import Blueprint, request, jsonify
from app.services.shopping_service import shopping_service

shopping_bp = Blueprint(
    "shopping",
    __name__,
    url_prefix="/api/shopping"
)

@shopping_bp.route("/recommendations", methods=["POST"])
def get_shopping_recommendations():
    data = request.get_json()

    if not data or "analysis" not in data:
        return jsonify({
            "success": False,
            "error": "Missing analysis data"
        }), 400

    analysis = data["analysis"]

    search_query = shopping_service.generate_search_query(analysis)
    recommendations = shopping_service.generate_shopping_links(analysis)

    return jsonify({
        "success": True,
        "search_query": search_query,
        "recommendations": recommendations
    }), 200
