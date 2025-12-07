/**
 * Style Analysis Service
 * Business logic for AI style analysis using Gemini
 */

const geminiService = require('./geminiService');

class StyleAnalysisService {
  /**
   * Analyze clothing image
   * @param {Buffer} imageBuffer - Image buffer
   * @param {string} mimeType - Image MIME type
   * @param {Object} imageInfo - Original image info
   * @returns {Promise<Object>} Analysis result with image info
   */
  async analyzeImage(imageBuffer, mimeType, imageInfo) {
    try {
      // Call Gemini AI for analysis
      const analysis = await geminiService.analyzeClothingImage(imageBuffer, mimeType);

      // Return structured response
      return {
        analysis,
        imageInfo: {
          originalName: imageInfo.originalName,
          size: imageInfo.size,
          mimeType: imageInfo.mimeType
        }
      };
    } catch (error) {
      console.error('Error in analyzeImage:', error);
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
  }

  /**
   * Generate comprehensive style profile from wardrobe
   * @param {Array} wardrobeItems - Array of wardrobe items with analysis
   * @returns {Promise<Object>} Style profile
   */
  async generateStyleProfile(wardrobeItems) {
    try {
      if (!wardrobeItems || wardrobeItems.length === 0) {
        throw new Error('Wardrobe items are required');
      }

      if (wardrobeItems.length < 3) {
        throw new Error('At least 3 items are required to generate a style profile');
      }

      // Extract analysis from items
      const items = wardrobeItems.map(item => item.analysis || item);

      // Generate profile using Gemini
      const profile = await geminiService.generateStyleProfile(items);

      // Enhance profile with additional insights
      const enhancedProfile = this._enhanceProfile(profile, items);

      return enhancedProfile;
    } catch (error) {
      console.error('Error in generateStyleProfile:', error);
      throw new Error(`Failed to generate style profile: ${error.message}`);
    }
  }

  /**
   * Get shopping recommendations based on item analysis
   * @param {Object} itemAnalysis - Analysis of a clothing item
   * @returns {Promise<Object>} Recommendations
   */
  async getRecommendations(itemAnalysis) {
    try {
      if (!itemAnalysis) {
        throw new Error('Item analysis is required');
      }

      // Get recommendations from Gemini
      const recommendations = await geminiService.findSimilarItems(itemAnalysis);

      // Enhance recommendations with additional data
      const enhancedRecommendations = this._enhanceRecommendations(recommendations, itemAnalysis);

      return enhancedRecommendations;
    } catch (error) {
      console.error('Error in getRecommendations:', error);
      throw new Error(`Failed to get recommendations: ${error.message}`);
    }
  }

  /**
   * Enhance profile with additional insights
   * @private
   * @param {Object} profile - Base profile from AI
   * @param {Array} items - Wardrobe items
   * @returns {Object} Enhanced profile
   */
  _enhanceProfile(profile, items) {
    // Calculate additional statistics
    const formalities = items.map(item => item.formality).filter(Boolean);
    const seasons = items.flatMap(item => item.season || []);
    
    return {
      ...profile,
      statistics: {
        totalItems: items.length,
        uniqueTypes: [...new Set(items.map(item => item.itemType))].length,
        mostCommonFormality: this._getMostCommon(formalities),
        seasonalCoverage: [...new Set(seasons)]
      },
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Enhance recommendations with additional data
   * @private
   * @param {Object} recommendations - Base recommendations from AI
   * @param {Object} itemAnalysis - Original item analysis
   * @returns {Object} Enhanced recommendations
   */
  _enhanceRecommendations(recommendations, itemAnalysis) {
    return {
      ...recommendations,
      originalItem: {
        type: itemAnalysis.itemType,
        style: itemAnalysis.style,
        colors: itemAnalysis.colors
      },
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Get most common value from array
   * @private
   * @param {Array} arr - Array of values
   * @returns {*} Most common value
   */
  _getMostCommon(arr) {
    if (arr.length === 0) return null;
    
    const counts = {};
    arr.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });

    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }
}

module.exports = new StyleAnalysisService();
