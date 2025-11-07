const { verifyToken } = require('../utils/jwt');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({
            status: 108,
            message: 'Token  tidak valid atau kadaluwarsa',
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
            message: 'Token tidak valid atau kadaluwarsa',
            data: null
        });
    }
};

module.exports = { authenticateToken };