const express = require('express');
const { createTransaction, topup, getTransactionHistory } = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/transaction', authenticateToken, createTransaction);
router.post('/topup', authenticateToken, topup);
router.get('/transaction/history', authenticateToken, getTransactionHistory);

module.exports = router;