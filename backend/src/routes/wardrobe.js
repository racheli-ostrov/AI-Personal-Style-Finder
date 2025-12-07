/**
 * Wardrobe Routes
 * Defines URL endpoints and maps them to controller actions
 */

const express = require('express');
const wardrobeController = require('../controllers/wardrobeController');

const router = express.Router();

/**
 * GET /api/wardrobe/statistics
 * Get wardrobe statistics
 * Note: This must come BEFORE /:id routes to avoid route conflicts
 */
router.get('/statistics', wardrobeController.getStatistics.bind(wardrobeController));

/**
 * GET /api/wardrobe
 * Get all wardrobe items
 */
router.get('/', wardrobeController.getAllItems.bind(wardrobeController));

/**
 * POST /api/wardrobe
 * Add item to wardrobe
 */
router.post('/', wardrobeController.addItem.bind(wardrobeController));

/**
 * DELETE /api/wardrobe/:id
 * Remove item from wardrobe
 */
router.delete('/:id', wardrobeController.deleteItem.bind(wardrobeController));

/**
 * PATCH /api/wardrobe/:id/favorite
 * Toggle favorite status
 */
router.patch('/:id/favorite', wardrobeController.toggleFavorite.bind(wardrobeController));

/**
 * DELETE /api/wardrobe
 * Clear entire wardrobe
 */
router.delete('/', wardrobeController.clearWardrobe.bind(wardrobeController));

module.exports = router;
