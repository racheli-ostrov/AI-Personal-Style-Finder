/**
 * Wardrobe Controller
 * Handles HTTP requests for wardrobe management
 */

const wardrobeService = require('../services/wardrobeService');

class WardrobeController {
  /**
   * GET /api/wardrobe
   * Get all wardrobe items
   */
  async getAllItems(req, res) {
    try {
      const items = wardrobeService.getAllItems();
      
      res.json({
        success: true,
        data: items,
        count: items.length
      });
    } catch (error) {
      console.error('Error in getAllItems:', error);
      res.status(500).json({
        error: {
          message: 'Failed to retrieve wardrobe items'
        }
      });
    }
  }

  /**
   * POST /api/wardrobe
   * Add new item to wardrobe
   */
  async addItem(req, res) {
    try {
      const { analysis, imageData } = req.body;

      // Validation
      if (!analysis) {
        return res.status(400).json({
          error: { message: 'Analysis data is required' }
        });
      }

      // Add item via service
      const newItem = wardrobeService.addItem(analysis, imageData);

      res.status(201).json({
        success: true,
        data: newItem
      });
    } catch (error) {
      console.error('Error in addItem:', error);
      res.status(500).json({
        error: {
          message: 'Failed to add item to wardrobe'
        }
      });
    }
  }

  /**
   * DELETE /api/wardrobe/:id
   * Remove item from wardrobe
   */
  async deleteItem(req, res) {
    try {
      const { id } = req.params;

      const deleted = wardrobeService.deleteItem(id);

      if (!deleted) {
        return res.status(404).json({
          error: { message: 'Item not found' }
        });
      }

      res.json({
        success: true,
        message: 'Item removed from wardrobe'
      });
    } catch (error) {
      console.error('Error in deleteItem:', error);
      res.status(500).json({
        error: {
          message: 'Failed to delete item'
        }
      });
    }
  }

  /**
   * PATCH /api/wardrobe/:id/favorite
   * Toggle favorite status
   */
  async toggleFavorite(req, res) {
    try {
      const { id } = req.params;

      const item = wardrobeService.toggleFavorite(id);

      if (!item) {
        return res.status(404).json({
          error: { message: 'Item not found' }
        });
      }

      res.json({
        success: true,
        data: item
      });
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      res.status(500).json({
        error: {
          message: 'Failed to update favorite status'
        }
      });
    }
  }

  /**
   * DELETE /api/wardrobe
   * Clear entire wardrobe
   */
  async clearWardrobe(req, res) {
    try {
      const count = wardrobeService.clearWardrobe();

      res.json({
        success: true,
        message: 'Wardrobe cleared',
        itemsCleared: count
      });
    } catch (error) {
      console.error('Error in clearWardrobe:', error);
      res.status(500).json({
        error: {
          message: 'Failed to clear wardrobe'
        }
      });
    }
  }

  /**
   * GET /api/wardrobe/statistics
   * Get wardrobe statistics
   */
  async getStatistics(req, res) {
    try {
      const stats = wardrobeService.getStatistics();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getStatistics:', error);
      res.status(500).json({
        error: {
          message: 'Failed to get statistics'
        }
      });
    }
  }
}

module.exports = new WardrobeController();
