const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    // Allow tests to run without API key
    if (!process.env.GEMINI_API_KEY && process.env.NODE_ENV !== 'test') {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    
    // Only initialize if API key is present
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  /**
   * Analyze clothing item from image
   * @param {Buffer} imageBuffer - Image buffer
   * @param {string} mimeType - Image MIME type
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeClothingImage(imageBuffer, mimeType) {
    try {
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: mimeType
        }
      };

      const prompt = `Analyze this clothing item in detail. Provide a JSON response with the following structure:
{
  "itemType": "type of clothing (e.g., shirt, pants, dress, jacket)",
  "colors": ["primary color", "secondary color"],
  "style": "style category (e.g., casual, formal, sporty, elegant, vintage)",
  "patterns": ["pattern types if any, e.g., striped, floral, solid"],
  "fabric": "estimated fabric type (e.g., cotton, denim, silk, wool)",
  "formality": "formality level (casual, business casual, formal)",
  "season": ["suitable seasons"],
  "features": ["distinctive features"],
  "tags": ["style tags for matching"]
}

Be specific and detailed in your analysis. Only respond with valid JSON.`;

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from Gemini response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error analyzing image with Gemini:', error);
      throw new Error(`Image analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate style profile from multiple wardrobe items
   * @param {Array} wardrobeItems - Array of analyzed items
   * @returns {Promise<Object>} Style profile
   */
  async generateStyleProfile(wardrobeItems) {
    try {
      const prompt = `Based on this wardrobe collection, create a comprehensive style profile:

${JSON.stringify(wardrobeItems, null, 2)}

Provide a JSON response with:
{
  "dominantStyle": "main style category",
  "colorPalette": ["most frequent colors"],
  "preferredFormality": "typical formality level",
  "stylePersona": "brief description of fashion persona",
  "recommendations": {
    "strengths": ["what works well in this wardrobe"],
    "gaps": ["what's missing"],
    "suggestions": ["specific items to add"]
  },
  "shoppingKeywords": ["keywords for finding similar items"]
}

Only respond with valid JSON.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from Gemini response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating style profile:', error);
      throw new Error(`Style profile generation failed: ${error.message}`);
    }
  }

  /**
   * Find similar items based on a clothing description
   * @param {Object} itemAnalysis - Analysis of the reference item
   * @returns {Promise<Object>} Recommendations
   */
  async findSimilarItems(itemAnalysis) {
    try {
      const prompt = `Based on this clothing item analysis:
${JSON.stringify(itemAnalysis, null, 2)}

Generate shopping recommendations in JSON format:
{
  "searchQueries": ["optimized search terms for online shopping"],
  "similarStyles": ["alternative style suggestions"],
  "complementaryItems": ["items that would pair well"],
  "brands": ["recommended brands matching this style"],
  "priceRange": "suggested price range"
}

Only respond with valid JSON.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from Gemini response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error finding similar items:', error);
      throw new Error(`Similar items search failed: ${error.message}`);
    }
  }
}

module.exports = new GeminiService();
