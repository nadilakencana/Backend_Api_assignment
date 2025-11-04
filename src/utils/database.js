const{ Pool}= require('pg');

require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'nutech_db',
    port: process.env.DB_PORT || 5432,
    allowExitOnIdle: true
});

module.exports= pool;