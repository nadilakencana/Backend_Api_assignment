const pool = require('./src/utils/database');

async function testConnection() {
    try {
        console.log('Testing database connection...');
        console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
        console.log('NODE_ENV:', process.env.NODE_ENV);
        
        const client = await pool.connect();
        console.log('✅ Database connected successfully');
        
        const result = await client.query('SELECT NOW()');
        console.log('✅ Query test successful:', result.rows[0]);
        
        client.release();
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testConnection();