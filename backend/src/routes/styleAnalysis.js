/**
 * Style Analysis Routes
 * Defines URL endpoints and maps them to controller actions
 */

const express = require('express');
const multer = require('multer');
const styleAnalysisController = require('../controllers/styleAnalysisController');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

/**
 * POST /api/style/analyze
 * Analyze a single clothing item image
 */
router.post('/analyze', upload.single('image'), styleAnalysisController.analyzeImage.bind(styleAnalysisController));

/**
 * POST /api/style/profile
 * Generate style profile from wardrobe items
 */
router.post('/profile', styleAnalysisController.generateProfile.bind(styleAnalysisController));

/**
 * POST /api/style/recommendations
 * Get shopping recommendations based on item
 */
router.post('/recommendations', styleAnalysisController.getRecommendations.bind(styleAnalysisController));

module.exports = router;
