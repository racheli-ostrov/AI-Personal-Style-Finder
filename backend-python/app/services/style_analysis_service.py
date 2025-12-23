from services.gemini_service import gemini_service
from services.wardrobe_service import wardrobe_service
from datetime import datetime

class StyleAnalysisService:
    def analyze_image(self, image_data, mime_type, image_info):
        analysis = gemini_service.analyze_clothing_image(
            image_data,
            mime_type
        )

        return {
            "analysis": analysis,
            "imageInfo": image_info,
            "analyzedAt": datetime.now().isoformat()
        }

    def generate_style_profile(self, user_id: str):
        items = wardrobe_service.get_all_items(user_id)

        if len(items) < 3:
            raise ValueError("Need at least 3 wardrobe items")

        # Avoid sending raw image data to Gemini when generating profile
        # Trim `imageInfo.data` fields to reduce payload size and prevent 413 errors
        trimmed_items = []
        for it in items:
            it_copy = dict(it)
            img = it_copy.get('image_info') or it_copy.get('imageInfo') or {}
            if isinstance(img, dict) and 'data' in img:
                img = dict(img)
                img.pop('data', None)
                it_copy['image_info'] = img
                it_copy['imageInfo'] = img
            trimmed_items.append(it_copy)

        profile = gemini_service.generate_style_profile(trimmed_items)
        stats = wardrobe_service.get_statistics(user_id)

        return {
            "profile": profile,
            "statistics": stats,
            "generatedAt": datetime.now().isoformat()
        }

style_analysis_service = StyleAnalysisService()
