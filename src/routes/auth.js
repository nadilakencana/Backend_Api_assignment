const express = require('express');
const { regist ,login, profile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/registration', regist);

module.exports = router;