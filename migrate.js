const fs = require('fs');
const path = require('path');
const pool = require('./src/utils/database');

async function runMigration() {
    try {
        const sqlFile = fs.readFileSync(path.join(__dirname, 'migrations', 'init.sql'), 'utf8');
        await pool.query(sqlFile);
        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();