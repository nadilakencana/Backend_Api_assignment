# 📋 Step-by-Step Guide: Nutech API Assignment

## 🎯 Overview
Panduan lengkap untuk membuat REST API dengan Node.js + Express.js sesuai requirement Nutech Integration.

---

## 📦 STEP 1: Setup Project

### 1.1 Buat Project Folder
```bash
mkdir nutech-api-assignment
cd nutech-api-assignment
```

### 1.2 Initialize NPM
```bash
npm init -y
```

### 1.3 Install Dependencies
```bash
# Production dependencies
npm install express bcryptjs jsonwebtoken pg joi cors dotenv multer

# Development dependencies
npm install --save-dev nodemon
```

### 1.4 Update package.json
Edit bagian scripts:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## 🗄️ STEP 2: Database Setup

### 2.1 Buat file `.env`
```env
PORT=3000
JWT_SECRET=nutech_secret_key_2024
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nutech_db
DB_USER=postgres
DB_PASSWORD=password
```

### 2.2 Buat file `database.sql`
```sql
-- Create database
CREATE DATABASE nutech_db;

-- Connect to database
\c nutech_db;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    balance DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(50) UNIQUE NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    service_icon VARCHAR(255),
    service_tariff DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Banners table
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    banner_name VARCHAR(100) NOT NULL,
    banner_image VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    service_code VARCHAR(50),
    service_name VARCHAR(100),
    transaction_type VARCHAR(20) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample services
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES
('PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000),
('PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000),
('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000),
('QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000),
('ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000);

-- Insert sample banners
INSERT INTO banners (banner_name, banner_image, description) VALUES
('Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');
```

### 2.3 Setup PostgreSQL
1. Install PostgreSQL
2. Jalankan: `psql -U postgres`
3. Execute SQL script: `\i database.sql`

---

## 📁 STEP 3: Buat Struktur Folder

```bash
mkdir src
mkdir src/controllers
mkdir src/middleware  
mkdir src/models
mkdir src/routes
mkdir src/utils
mkdir uploads
```

---

## 🔧 STEP 4: Utilities

### 4.1 Database Connection - `src/utils/database.js`
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'nutech_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

module.exports = pool;
```

### 4.2 JWT Utility - `src/utils/jwt.js`
```javascript
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
```

### 4.3 Validation - `src/utils/validation.js`
```javascript
const Joi = require('joi');

const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  password: Joi.string().min(8).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const topupSchema = Joi.object({
  top_up_amount: Joi.number().positive().required()
});

const transactionSchema = Joi.object({
  service_code: Joi.string().required()
});

const profileUpdateSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required()
});

module.exports = {
  registrationSchema,
  loginSchema,
  topupSchema,
  transactionSchema,
  profileUpdateSchema
};
```

---

## 🛡️ STEP 5: Middleware

### 5.1 Auth Middleware - `src/middleware/auth.js`
```javascript
const { verifyToken } = require('../utils/jwt');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 108,
      message: 'Token tidak tidak valid atau kadaluwarsa',
      data: null
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 108,
      message: 'Token tidak tidak valid atau kadaluwarsa',
      data: null
    });
  }
};

module.exports = { authenticateToken };
```

### 5.2 Upload Middleware - `src/middleware/upload.js`
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format Image tidak sesuai'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
```

---

## 📊 STEP 6: Models

### 6.1 User Model - `src/models/User.js`
```javascript
const pool = require('../utils/database');

class User {
  static async create(userData) {
    const { email, first_name, last_name, password } = userData;
    const query = `
      INSERT INTO users (email, first_name, last_name, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name, created_at
    `;
    const values = [email, first_name, last_name, password];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, first_name, last_name, profile_image, balance FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateProfile(id, userData) {
    const { first_name, last_name } = userData;
    const query = `
      UPDATE users 
      SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, email, first_name, last_name, profile_image
    `;
    const values = [first_name, last_name, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateBalance(id, amount, operation = 'add') {
    const operator = operation === 'add' ? '+' : '-';
    const query = `
      UPDATE users 
      SET balance = balance ${operator} $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING balance
    `;
    const values = [amount, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getBalance(id) {
    const query = 'SELECT balance FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = User;
```

### 6.2 Service Model - `src/models/Service.js`
```javascript
const pool = require('../utils/database');

class Service {
  static async getAll() {
    const query = 'SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY service_name';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findByCode(serviceCode) {
    const query = 'SELECT * FROM services WHERE service_code = $1';
    const result = await pool.query(query, [serviceCode]);
    return result.rows[0];
  }
}

module.exports = Service;
```

### 6.3 Banner Model - `src/models/Banner.js`
```javascript
const pool = require('../utils/database');

class Banner {
  static async getAll() {
    const query = 'SELECT banner_name, banner_image, description FROM banners ORDER BY id';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Banner;
```

### 6.4 Transaction Model - `src/models/Transaction.js`
```javascript
const pool = require('../utils/database');

class Transaction {
  static async create(transactionData) {
    const { user_id, invoice_number, service_code, service_name, transaction_type, total_amount } = transactionData;
    const query = `
      INSERT INTO transactions (user_id, invoice_number, service_code, service_name, transaction_type, total_amount)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [user_id, invoice_number, service_code, service_name, transaction_type, total_amount];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getByUserId(userId, limit = null, offset = 0) {
    let query = `
      SELECT invoice_number, transaction_type, total_amount, created_on, service_code, service_name
      FROM transactions 
      WHERE user_id = $1 
      ORDER BY created_on DESC
    `;
    const values = [userId];

    if (limit) {
      query += ` LIMIT $2 OFFSET $3`;
      values.push(limit, offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  static generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const timestamp = Date.now();
    return `INV${year}${month}${day}-${timestamp}`;
  }
}

module.exports = Transaction;
```

---

## 🎮 STEP 7: Controllers

### 7.1 Auth Controller - `src/controllers/authController.js`
```javascript
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { registrationSchema, loginSchema } = require('../utils/validation');

const register = async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 102,
        message: 'Parameter email tidak sesuai format',
        data: null
      });
    }

    const { email, first_name, last_name, password } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: 102,
        message: 'Email sudah terdaftar',
        data: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, first_name, last_name, password: hashedPassword });

    res.status(200).json({
      status: 0,
      message: 'Registrasi berhasil silahkan login',
      data: null
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 102,
        message: 'Parameter email atau password tidak sesuai format',
        data: null
      });
    }

    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 103,
        message: 'Username atau password salah',
        data: null
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 103,
        message: 'Username atau password salah',
        data: null
      });
    }

    const token = generateToken({ userId: user.id, email: user.email });

    res.status(200).json({
      status: 0,
      message: 'Login Sukses',
      data: { token }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

module.exports = { register, login };
```

### 7.2 Profile Controller - `src/controllers/profileController.js`
```javascript
const User = require('../models/User');
const { profileUpdateSchema } = require('../utils/validation');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { error } = profileUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 102,
        message: 'Parameter tidak sesuai format',
        data: null
      });
    }

    const { first_name, last_name } = req.body;
    const updatedUser = await User.updateProfile(req.user.userId, { first_name, last_name });

    res.status(200).json({
      status: 0,
      message: 'Update Pofile berhasil',
      data: {
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        profile_image: updatedUser.profile_image
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

module.exports = { getProfile, updateProfile };
```

### 7.3 Information Controller - `src/controllers/informationController.js`
```javascript
const Service = require('../models/Service');
const Banner = require('../models/Banner');

const getServices = async (req, res) => {
  try {
    const services = await Service.getAll();
    
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: services
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

const getBanners = async (req, res) => {
  try {
    const banners = await Banner.getAll();
    
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: banners
    });

  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

module.exports = { getServices, getBanners };
```

### 7.4 Transaction Controller - `src/controllers/transactionController.js`
```javascript
const User = require('../models/User');
const Service = require('../models/Service');
const Transaction = require('../models/Transaction');
const { topupSchema, transactionSchema } = require('../utils/validation');

const getBalance = async (req, res) => {
  try {
    const balance = await User.getBalance(req.user.userId);
    
    res.status(200).json({
      status: 0,
      message: 'Get Balance Berhasil',
      data: {
        balance: parseFloat(balance.balance)
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

    if (top_up_amount <= 0) {
      return res.status(400).json({
        status: 102,
        message: 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
        data: null
      });
    }

    const updatedBalance = await User.updateBalance(req.user.userId, top_up_amount, 'add');

    const invoiceNumber = Transaction.generateInvoiceNumber();
    await Transaction.create({
      user_id: req.user.userId,
      invoice_number: invoiceNumber,
      service_code: null,
      service_name: 'Top Up Balance',
      transaction_type: 'TOPUP',
      total_amount: top_up_amount
    });

    res.status(200).json({
      status: 0,
      message: 'Top Up Balance berhasil',
      data: {
        balance: parseFloat(updatedBalance.balance)
      }
    });

  } catch (error) {
    console.error('Topup error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

const transaction = async (req, res) => {
  try {
    const { error } = transactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 102,
        message: 'Service ataus Layanan tidak ditemukan',
        data: null
      });
    }

    const { service_code } = req.body;

    const service = await Service.findByCode(service_code);
    if (!service) {
      return res.status(400).json({
        status: 102,
        message: 'Service ataus Layanan tidak ditemukan',
        data: null
      });
    }

    const userBalance = await User.getBalance(req.user.userId);
    if (parseFloat(userBalance.balance) < parseFloat(service.service_tariff)) {
      return res.status(400).json({
        status: 102,
        message: 'Saldo tidak mencukupi',
        data: null
      });
    }

    await User.updateBalance(req.user.userId, service.service_tariff, 'subtract');

    const invoiceNumber = Transaction.generateInvoiceNumber();
    const transactionRecord = await Transaction.create({
      user_id: req.user.userId,
      invoice_number: invoiceNumber,
      service_code: service.service_code,
      service_name: service.service_name,
      transaction_type: 'PAYMENT',
      total_amount: service.service_tariff
    });

    res.status(200).json({
      status: 0,
      message: 'Transaksi berhasil',
      data: {
        invoice_number: transactionRecord.invoice_number,
        service_code: transactionRecord.service_code,
        service_name: transactionRecord.service_name,
        transaction_type: transactionRecord.transaction_type,
        total_amount: parseFloat(transactionRecord.total_amount),
        created_on: transactionRecord.created_on
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
    const { offset = 0, limit } = req.query;
    
    const transactions = await Transaction.getByUserId(
      req.user.userId, 
      limit ? parseInt(limit) : null, 
      parseInt(offset)
    );

    const formattedTransactions = transactions.map(transaction => ({
      invoice_number: transaction.invoice_number,
      transaction_type: transaction.transaction_type,
      description: transaction.service_name || 'Top Up Balance',
      total_amount: parseFloat(transaction.total_amount),
      created_on: transaction.created_on
    }));

    res.status(200).json({
      status: 0,
      message: 'Get History Berhasil',
      data: {
        offset: parseInt(offset),
        limit: limit ? parseInt(limit) : null,
        records: formattedTransactions
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

module.exports = { getBalance, topup, transaction, getTransactionHistory };
```

---

## 🛣️ STEP 8: Routes

### 8.1 Auth Routes - `src/routes/auth.js`
```javascript
const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/registration', register);
router.post('/login', login);

module.exports = router;
```

### 8.2 Profile Routes - `src/routes/profile.js`
```javascript
const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/profile/update', authenticateToken, updateProfile);

module.exports = router;
```

### 8.3 Information Routes - `src/routes/information.js`
```javascript
const express = require('express');
const { getServices, getBanners } = require('../controllers/informationController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/services', authenticateToken, getServices);
router.get('/banner', authenticateToken, getBanners);

module.exports = router;
```

### 8.4 Transaction Routes - `src/routes/transaction.js`
```javascript
const express = require('express');
const { getBalance, topup, transaction, getTransactionHistory } = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/balance', authenticateToken, getBalance);
router.post('/topup', authenticateToken, topup);
router.post('/transaction', authenticateToken, transaction);
router.get('/transaction/history', authenticateToken, getTransactionHistory);

module.exports = router;
```

---

## 🚀 STEP 9: Main Server

### 9.1 Server File - `server.js`
```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const profileRoutes = require('./src/routes/profile');
const informationRoutes = require('./src/routes/information');
const transactionRoutes = require('./src/routes/transaction');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', informationRoutes);
app.use('/', transactionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Endpoint tidak ditemukan',
    data: null
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    status: 500,
    message: 'Internal server error',
    data: null
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
```

---

## 🧪 STEP 10: Testing

### 10.1 Buat file `.gitignore`
```
node_modules/
.env
uploads/*
!uploads/.gitkeep
*.log
.DS_Store
```

### 10.2 Buat file `uploads/.gitkeep`
(File kosong untuk menjaga folder uploads)

### 10.3 Test dengan Postman atau curl

#### Registration:
```bash
curl -X POST http://localhost:3000/registration \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@nutech-integrasi.com",
    "first_name": "Test",
    "last_name": "User",
    "password": "password123"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@nutech-integrasi.com",
    "password": "password123"
  }'
```

#### Get Profile (ganti TOKEN):
```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer TOKEN"
```

---

## 🚀 STEP 11: Deployment

### 11.1 Buat file `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 11.2 Deploy ke Railway
1. Push ke GitHub
2. Connect Railway dengan GitHub repo
3. Add PostgreSQL service
4. Set environment variables
5. Deploy!

---

## ✅ Checklist Pengerjaan

- [ ] Setup project & dependencies
- [ ] Database setup & connection
- [ ] Folder structure
- [ ] Utilities (database, jwt, validation)
- [ ] Middleware (auth, upload)
- [ ] Models (User, Service, Banner, Transaction)
- [ ] Controllers (auth, profile, information, transaction)
- [ ] Routes setup
- [ ] Main server file
- [ ] Testing endpoints
- [ ] Deployment setup

---

## 🎯 Tips Sukses

1. **Kerjakan step by step** - jangan skip
2. **Test setiap endpoint** setelah dibuat
3. **Check database** setelah operasi
4. **Handle error** dengan baik
5. **Gunakan Postman** untuk testing
6. **Commit code** secara berkala
7. **Baca error message** dengan teliti

**Selamat mengerjakan! 🚀**