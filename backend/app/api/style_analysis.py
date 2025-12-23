from flask import Blueprint, request, jsonify
from app.services.style_analysis_service import style_analysis_service
from app.services.wardrobe_service import wardrobe_service
import base64

style_analysis_bp = Blueprint(
    "style",
    __name__,
    url_prefix="/api/style"
)

@style_analysis_bp.route("/analyze", methods=["POST"])
def analyze_image():
    if "image" not in request.files:
        return jsonify({"success": False, "error": "No image provided"}), 400

    file = request.files["image"]
    image_data = file.read()
    mime_type = file.content_type

    user_id = request.form.get("userId")
    if not user_id:
        return jsonify({"success": False, "error": "User ID required"}), 401

    image_info = {
        "filename": file.filename,
        "size": len(image_data),
        "mimetype": mime_type,
        "data": f"data:{mime_type};base64," +
                base64.b64encode(image_data).decode()
    }

    result = style_analysis_service.analyze_image(
        image_data,
        mime_type,
        image_info
    )

    wardrobe_item = wardrobe_service.add_item(
        user_id,
        image_info,
        result["analysis"]
    )

    return jsonify({
        "success": True,
        "data": {
            "analysis": result["analysis"],
            "wardrobeItem": wardrobe_item
        }
    }), 200


@style_analysis_bp.route("/profile", methods=["POST"])
def generate_profile():
    data = request.get_json()
    user_id = data.get("userId") if data else None

    if not user_id:
        return jsonify({"success": False, "error": "User ID required"}), 401

    try:
        result = style_analysis_service.generate_style_profile(user_id)
        return jsonify({
            "success": True,
            "data": result
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400
