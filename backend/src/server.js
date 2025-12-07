const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const styleAnalysisRoutes = require('./routes/styleAnalysis');
const wardrobeRoutes = require('./routes/wardrobe');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'AI Personal Style Finder API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/style', styleAnalysisRoutes);
app.use('/api/wardrobe', wardrobeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: { 
      message: 'Route not found',
      status: 404
    }
  });
});

// Start server (skip if in test environment and server already running)
let server;
if (process.env.NODE_ENV !== 'test' || !module.parent) {
  server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = { app, server };
