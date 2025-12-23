from flask import Blueprint, request, jsonify
from services.wardrobe_service import wardrobe_service

wardrobe_bp = Blueprint(
    "wardrobe",
    __name__,
    url_prefix="/api/wardrobe"
)

@wardrobe_bp.route("/", methods=["GET"])
def get_all_items():
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"success": False, "error": "User ID required"}), 401

    items = wardrobe_service.get_all_items(user_id)
    return jsonify({"success": True, "data": items})


@wardrobe_bp.route("/", methods=["POST"])
def add_item():
    data = request.get_json() or {}
    user_id = data.get("userId")
    image_info = data.get("imageInfo")
    analysis = data.get("analysis") or {}

    if not user_id or not image_info:
        return jsonify({"success": False, "error": "userId and imageInfo required"}), 400

    item = wardrobe_service.add_item(user_id, image_info, analysis)
    return jsonify({"success": True, "data": item}), 201


@wardrobe_bp.route("/", methods=["DELETE"])
def clear_wardrobe():
    user_id = request.args.get("userId")
    wardrobe_service.clear_wardrobe(user_id)
    return jsonify({"success": True})


@wardrobe_bp.route("/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    user_id = request.args.get("userId")
    wardrobe_service.delete_item(user_id, item_id)
    return jsonify({"success": True})


@wardrobe_bp.route("/<int:item_id>/favorite", methods=["PATCH"])
def toggle_favorite(item_id):
    user_id = request.args.get("userId")
    item = wardrobe_service.toggle_favorite(user_id, item_id)

    if not item:
        return jsonify({"success": False, "error": "Item not found"}), 404

    return jsonify({"success": True, "data": item})
