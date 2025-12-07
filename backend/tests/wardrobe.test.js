/**
 * Wardrobe Routes Tests (Legacy)
 * This file is kept for backwards compatibility
 * New tests should be added to wardrobeController.test.js
 */

const request = require('supertest');
const express = require('express');
const wardrobeRoutes = require('../src/routes/wardrobe');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/wardrobe', wardrobeRoutes);

describe('Wardrobe API Tests (Legacy)', () => {
  beforeEach(async () => {
    // Clear wardrobe before each test
    await request(app).delete('/api/wardrobe');
  });

  test('GET /api/wardrobe returns initial state', async () => {
    const response = await request(app).get('/api/wardrobe');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual([]);
    expect(response.body.count).toBe(0);
  });

  test('POST /api/wardrobe adds item successfully', async () => {
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
  });
});
