const jwt = require('jsonwebtoken');
require('dotenv').config();

const getgenerateToken = (payload) =>{
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '12h'});
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    getgenerateToken,
    verifyToken
};