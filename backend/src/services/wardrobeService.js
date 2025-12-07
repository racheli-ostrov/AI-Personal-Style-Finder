/**
 * Wardrobe Service
 * Business logic for managing wardrobe items
 */

// In-memory storage (in production, this would be a database)
let wardrobe = [];
let itemIdCounter = 1000; // Start from 1000 for unique IDs

class WardrobeService {
  /**
   * Get all wardrobe items
   * @returns {Array} All wardrobe items
   */
  getAllItems() {
    return wardrobe;
  }

  /**
   * Get wardrobe item by ID
   * @param {string} id - Item ID
   * @returns {Object|null} Wardrobe item or null
   */
  getItemById(id) {
    return wardrobe.find(item => item.id === id) || null;
  }

  /**
   * Add new item to wardrobe
   * @param {Object} analysis - Item analysis data
   * @param {string} imageData - Base64 image data
   * @returns {Object} Created item
   */
  addItem(analysis, imageData) {
    const newItem = {
      id: `item-${++itemIdCounter}`, // Use counter for unique IDs
      analysis,
      imageData,
      addedAt: new Date().toISOString(),
      favorite: false
    };

    wardrobe.push(newItem);
    return newItem;
  }

  /**
   * Delete item from wardrobe
   * @param {string} id - Item ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteItem(id) {
    const initialLength = wardrobe.length;
    wardrobe = wardrobe.filter(item => item.id !== id);
    return wardrobe.length < initialLength;
  }

  /**
   * Toggle favorite status of item
   * @param {string} id - Item ID
   * @returns {Object|null} Updated item or null
   */
  toggleFavorite(id) {
    const item = this.getItemById(id);
    if (!item) {
      return null;
    }

    item.favorite = !item.favorite;
    return item;
  }

  /**
   * Clear entire wardrobe
   * @returns {number} Number of items cleared
   */
  clearWardrobe() {
    const count = wardrobe.length;
    wardrobe = [];
    return count;
  }

  /**
   * Get wardrobe statistics
   * @returns {Object} Statistics
   */
  getStatistics() {
    return {
      totalItems: wardrobe.length,
      favoriteItems: wardrobe.filter(item => item.favorite).length,
      itemTypes: [...new Set(wardrobe.map(item => item.analysis.itemType))],
      dominantColors: this._getMostCommonColors()
    };
  }

  /**
   * Get most common colors in wardrobe
   * @private
   * @returns {Array} Top 5 colors
   */
  _getMostCommonColors() {
    const colorCount = {};
    wardrobe.forEach(item => {
      if (item.analysis.colors) {
        item.analysis.colors.forEach(color => {
          colorCount[color] = (colorCount[color] || 0) + 1;
        });
      }
    });

    return Object.entries(colorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([color]) => color);
  }
}

module.exports = new WardrobeService();
