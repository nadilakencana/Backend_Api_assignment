const crypto = require('crypto');
const fs = require('fs');
const path = require('path');


const newSecret = crypto.randomBytes(64).toString('hex');

console.log('JWT_SECRET baru:', newSecret);


const envPath = path.join(__dirname, '.env');
let envContent = fs.readFileSync(envPath, 'utf8');

if (envContent.includes('JWT_SECRET=')) {
    envContent = envContent.replace(/JWT_SECRET=.*/, `JWT_SECRET=${newSecret}`);
} else {
    envContent += `\nJWT_SECRET=${newSecret}`;
}

fs.writeFileSync(envPath, envContent);
