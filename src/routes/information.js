const express = require('express');
const { getBanners } = require('../controllers/bannerController');
const { getServices } = require('../controllers/serviceController');
const {getBalance} = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// public routes
router.get('/banner', getBanners);

// private routes

router.get('/services', authenticateToken, getServices);
router.get('/balance', authenticateToken, getBalance);

module.exports = router;