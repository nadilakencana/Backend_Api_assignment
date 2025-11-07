const{ Pool}= require('pg');

require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Connection string starts with:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) : 'NONE');

// Force new pool creation
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
    allowExitOnIdle: true
});

// Test connection on startup
pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('✅ Database connected successfully');
        release();
    }
});

module.exports= pool;
