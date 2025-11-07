const User = require('../models/User');
const Services = require('../models/Services');
const Transaction = require('../models/Transaction');
const {topupSchema, transactionSchema} = require('../utils/validation');

const getBalance = async (req, res) => {
    try {
        const user = await Transaction.getBalance(req.user.email);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User tidak ditemukan',
                data: null
            });
        }

        res.status(200).json({
            status: 0,
            message: 'Get Balance Berhasi',
            data: {
                balance: parseInt(user.balance)
            }
        });

    } catch (error) {
        console.error('Get balance error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
};

const topup = async (req, res) => {
    try {
        const { error } = topupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 102,
                message: 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
                data: null
            });
        }

        const { top_up_amount } = req.body;

        const transaction = await Transaction.createTransection({
            user_email: req.user.email,
            invoice_number: Transaction.generateInvoiceNumber(),
            service_code: null,
            service_name: 'Top Up Balance',
            transaction_type: 'TOPUP',
            total_amount: top_up_amount
        });

        const updatedBalance = await Transaction.topup(req.user.email, top_up_amount);

        res.status(200).json({
            status: 0,
            message: 'Top Up Balance berhasil',
            data: {
                balance: parseInt(updatedBalance.balance)
            }
        });

    } catch (error) {
        console.error('Top up error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
};

const createTransaction = async (req, res) => {
  try {
    const { service_code } = req.body;
    
    if (!service_code) {
      return res.status(400).json({
        status: 102,
        message: 'Service atau Layanan tidak ditemukan',
        data: null
      });
    }

    
    const user = await User.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    // Get service details
    const service = await Services.findByCode(service_code);
    if (!service) {
      return res.status(400).json({
        status: 102,
        message: 'Service atau Layanan tidak ditemukan',
        data: null
      });
    }

    // Check if balance 
    if (parseFloat(user.balance) < parseFloat(service.service_tariff)) {
      return res.status(400).json({
        status: 102,
        message: 'Saldo tidak mencukupi',
        data: null
      });
    }

    // Generate invoice number
    const invoice_number = Transaction.generateInvoiceNumber();

    // Create transaction member
    const transaction = await Transaction.createTransection({
      user_email: req.user.email,
      invoice_number,
      service_code: service.service_code,
      service_name: service.service_name,
      transaction_type: 'PAYMENT',
      total_amount: service.service_tariff
    });


    // Update user balance
    await User.updateBalanceByEmail(req.user.email, service.service_tariff, 'subtract');
    res.status(200).json({
      status: 0,
      message: 'Transaksi berhasil',
      data: {
        invoice_number: transaction.invoice_number,
        service_code: transaction.service_code,
        service_name: transaction.service_name,
        transaction_type: transaction.transaction_type,
        total_amount: transaction.total_amount,
        created_on: transaction.created_on
      }
    });

  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const { limit } = req.query;
    const email = req.user.email; // dari JWT payload
    
    const transactions = await Transaction.getHistoryTransection(
      email, 
      limit ? parseInt(limit) : null
    );

    res.status(200).json({
      status: 0,
      message: 'Get History Berhasil',
      data: {
        offset: 0,
        limit: limit ? parseInt(limit) : transactions.length,
        records: transactions
      }
    });

  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};


module.exports = {getBalance, topup, createTransaction, getTransactionHistory  };