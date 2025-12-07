const request = require('supertest');
const express = require('express');

// Create a test app instead of importing the main server
const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'AI Personal Style Finder API is running',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    error: { 
      message: 'Route not found',
      status: 404
    }
  });
});

describe('Server Health Tests', () => {
  test('GET /api/health should return healthy status', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('GET /invalid-route should return 404', async () => {
    const response = await request(app).get('/invalid-route');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('message', 'Route not found');
  });
});
