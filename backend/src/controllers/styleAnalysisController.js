/**
 * Style Analysis Controller
 * Handles HTTP requests for AI style analysis
 */

const styleAnalysisService = require('../services/styleAnalysisService');

class StyleAnalysisController {
  /**
   * POST /api/style/analyze
   * Analyze a single clothing item image
   */
  async analyzeImage(req, res) {
    try {
      // Validation
      if (!req.file) {
        return res.status(400).json({
          error: { message: 'No image file provided' }
        });
      }

      // Prepare image info
      const imageInfo = {
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype
      };

      // Call service to analyze
      const result = await styleAnalysisService.analyzeImage(
        req.file.buffer,
        req.file.mimetype,
        imageInfo
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in analyzeImage controller:', error);
      res.status(500).json({
        error: {
          message: error.message || 'Failed to analyze image'
        }
      });
    }
  }

  /**
   * POST /api/style/profile
   * Generate style profile from wardrobe items
   */
  async generateProfile(req, res) {
    try {
      const { wardrobeItems } = req.body;

      // Validation
      if (!wardrobeItems || !Array.isArray(wardrobeItems)) {
        return res.status(400).json({
          error: { message: 'Wardrobe items array is required' }
        });
      }

      if (wardrobeItems.length === 0) {
        return res.status(400).json({
          error: { message: 'At least one wardrobe item is required' }
        });
      }

      // Call service to generate profile
      const profile = await styleAnalysisService.generateStyleProfile(wardrobeItems);

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Error in generateProfile controller:', error);
      res.status(500).json({
        error: {
          message: error.message || 'Failed to generate style profile'
        }
      });
    }
  }

  /**
   * POST /api/style/recommendations
   * Get shopping recommendations based on item
   */
  async getRecommendations(req, res) {
    try {
      const { itemAnalysis } = req.body;

      // Validation
      if (!itemAnalysis) {
        return res.status(400).json({
          error: { message: 'Item analysis is required' }
        });
      }

      // Call service to get recommendations
      const recommendations = await styleAnalysisService.getRecommendations(itemAnalysis);

      res.json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      console.error('Error in getRecommendations controller:', error);
      res.status(500).json({
        error: {
          message: error.message || 'Failed to get recommendations'
        }
      });
    }
  }
}

module.exports = new StyleAnalysisController();
