/**
 * Wardrobe Controller Integration Tests
 * Tests HTTP endpoints for wardrobe management
 */

const request = require('supertest');
const express = require('express');
const wardrobeRoutes = require('../src/routes/wardrobe');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/wardrobe', wardrobeRoutes);

describe('Wardrobe API Integration Tests', () => {
  beforeEach(async () => {
    // Clear wardrobe before each test
    await request(app).delete('/api/wardrobe');
  });

  describe('GET /api/wardrobe', () => {
    test('should return empty wardrobe initially', async () => {
      const response = await request(app).get('/api/wardrobe');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });
  });

  describe('POST /api/wardrobe', () => {
    test('should add item to wardrobe', async () => {
      const mockItem = {
        analysis: {
          itemType: 'shirt',
          colors: ['blue'],
          style: 'casual'
        }
      };

      const response = await request(app)
        .post('/api/wardrobe')
        .send(mockItem);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.analysis).toEqual(mockItem.analysis);
      expect(response.body.data).toHaveProperty('addedAt');
      expect(response.body.data.favorite).toBe(false);
    });

    test('should return 400 when analysis is missing', async () => {
      const response = await request(app)
        .post('/api/wardrobe')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Analysis data is required');
    });
  });

  describe('DELETE /api/wardrobe/:id', () => {
    test('should delete item from wardrobe', async () => {
      // First add an item
      const addResponse = await request(app)
        .post('/api/wardrobe')
        .send({
          analysis: { itemType: 'shirt', colors: ['red'] }
        });
      
      const itemId = addResponse.body.data.id;

      // Then delete it
      const deleteResponse = await request(app)
        .delete(`/api/wardrobe/${itemId}`);
      
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);

      // Verify it's gone
      const getResponse = await request(app).get('/api/wardrobe');
      expect(getResponse.body.count).toBe(0);
    });

    test('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .delete('/api/wardrobe/nonexistent-id');
      
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/wardrobe/:id/favorite', () => {
    test('should toggle favorite status', async () => {
      // Add an item
      const addResponse = await request(app)
        .post('/api/wardrobe')
        .send({
          analysis: { itemType: 'dress' }
        });
      
      const itemId = addResponse.body.data.id;

      // Toggle favorite
      const toggleResponse = await request(app)
        .patch(`/api/wardrobe/${itemId}/favorite`);
      
      expect(toggleResponse.status).toBe(200);
      expect(toggleResponse.body.data.favorite).toBe(true);

      // Toggle again
      const toggleResponse2 = await request(app)
        .patch(`/api/wardrobe/${itemId}/favorite`);
      
      expect(toggleResponse2.body.data.favorite).toBe(false);
    });
  });

  describe('DELETE /api/wardrobe', () => {
    test('should clear entire wardrobe', async () => {
      // Add multiple items
      await request(app).post('/api/wardrobe').send({ analysis: { itemType: 'shirt' } });
      await request(app).post('/api/wardrobe').send({ analysis: { itemType: 'pants' } });

      // Clear wardrobe
      const response = await request(app).delete('/api/wardrobe');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify it's empty
      const getResponse = await request(app).get('/api/wardrobe');
      expect(getResponse.body.count).toBe(0);
    });
  });

  describe('GET /api/wardrobe/statistics', () => {
    test('should return wardrobe statistics', async () => {
      // Add items
      await request(app).post('/api/wardrobe').send({ 
        analysis: { 
          itemType: 'shirt',
          colors: ['blue', 'white']
        } 
      });
      
      await request(app).post('/api/wardrobe').send({ 
        analysis: { 
          itemType: 'pants',
          colors: ['black']
        } 
      });

      const response = await request(app).get('/api/wardrobe/statistics');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalItems).toBe(2);
      expect(response.body.data.itemTypes).toContain('shirt');
      expect(response.body.data.itemTypes).toContain('pants');
    });
  });
});
