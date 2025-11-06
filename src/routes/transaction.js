const express = require('express');
const { createTransaction, topup } = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/transaction', authenticateToken, createTransaction);
router.post('/topup', authenticateToken, topup);

module.exports = router;