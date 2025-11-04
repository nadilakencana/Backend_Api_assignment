const express = require('express');
const { login, profile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, profile);

module.exports = router;