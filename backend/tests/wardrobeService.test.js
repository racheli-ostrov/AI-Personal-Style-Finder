/**
 * Wardrobe Service Tests
 * Unit tests for wardrobe business logic
 */

const wardrobeService = require('../src/services/wardrobeService');

describe('Wardrobe Service', () => {
  beforeEach(() => {
    // Clear wardrobe before each test
    wardrobeService.clearWardrobe();
  });

  describe('getAllItems', () => {
    test('should return empty array initially', () => {
      const items = wardrobeService.getAllItems();
      expect(items).toEqual([]);
    });

    test('should return all items', () => {
      wardrobeService.addItem({ itemType: 'shirt' }, null);
      wardrobeService.addItem({ itemType: 'pants' }, null);
      
      const items = wardrobeService.getAllItems();
      expect(items).toHaveLength(2);
    });
  });

  describe('addItem', () => {
    test('should add item with all required fields', () => {
      const analysis = {
        itemType: 'shirt',
        colors: ['blue'],
        style: 'casual'
      };

      const item = wardrobeService.addItem(analysis, 'imageData');

      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('addedAt');
      expect(item.favorite).toBe(false);
      expect(item.analysis).toEqual(analysis);
      expect(item.imageData).toBe('imageData');
    });

    test('should generate unique IDs', () => {
      const item1 = wardrobeService.addItem({ itemType: 'shirt' }, null);
      const item2 = wardrobeService.addItem({ itemType: 'pants' }, null);

      expect(item1.id).not.toBe(item2.id);
    });
  });

  describe('getItemById', () => {
    test('should return item by ID', () => {
      const added = wardrobeService.addItem({ itemType: 'shirt' }, null);
      const found = wardrobeService.getItemById(added.id);

      expect(found).toEqual(added);
    });

    test('should return null for non-existent ID', () => {
      const found = wardrobeService.getItemById('nonexistent');
      expect(found).toBeNull();
    });
  });

  describe('deleteItem', () => {
    test('should delete existing item', () => {
      const item = wardrobeService.addItem({ itemType: 'shirt' }, null);
      const deleted = wardrobeService.deleteItem(item.id);

      expect(deleted).toBe(true);
      expect(wardrobeService.getAllItems()).toHaveLength(0);
    });

    test('should return false for non-existent item', () => {
      const deleted = wardrobeService.deleteItem('nonexistent');
      expect(deleted).toBe(false);
    });
  });

  describe('toggleFavorite', () => {
    test('should toggle favorite status', () => {
      const item = wardrobeService.addItem({ itemType: 'shirt' }, null);
      
      expect(item.favorite).toBe(false);
      
      const toggled1 = wardrobeService.toggleFavorite(item.id);
      expect(toggled1.favorite).toBe(true);
      
      const toggled2 = wardrobeService.toggleFavorite(item.id);
      expect(toggled2.favorite).toBe(false);
    });

    test('should return null for non-existent item', () => {
      const result = wardrobeService.toggleFavorite('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('clearWardrobe', () => {
    test('should clear all items', () => {
      wardrobeService.addItem({ itemType: 'shirt' }, null);
      wardrobeService.addItem({ itemType: 'pants' }, null);

      const count = wardrobeService.clearWardrobe();

      expect(count).toBe(2);
      expect(wardrobeService.getAllItems()).toHaveLength(0);
    });
  });

  describe('getStatistics', () => {
    test('should return correct statistics', () => {
      wardrobeService.addItem({ 
        itemType: 'shirt',
        colors: ['blue', 'white']
      }, null);
      
      wardrobeService.addItem({ 
        itemType: 'pants',
        colors: ['blue', 'black']
      }, null);

      const item = wardrobeService.addItem({ 
        itemType: 'shirt',
        colors: ['red']
      }, null);
      
      wardrobeService.toggleFavorite(item.id);

      const stats = wardrobeService.getStatistics();

      expect(stats.totalItems).toBe(3);
      expect(stats.favoriteItems).toBe(1);
      expect(stats.itemTypes).toContain('shirt');
      expect(stats.itemTypes).toContain('pants');
      expect(stats.dominantColors).toContain('blue');
    });
  });
});
