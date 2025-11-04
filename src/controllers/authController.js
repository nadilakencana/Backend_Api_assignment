const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Demo user (replace with database query)
        const user = {
            id: 1,
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10) // hashed password
        };

        // Check if user exists and password matches
        if (email === user.email && await bcrypt.compare(password, user.password)) {
            const token = generateToken({
                userId: user.id,
                email: user.email
            });

            return res.json({
                status: 0,
                message: 'Login Sukses',
                data: { token }
            });
        }

        res.status(401).json({
            status: 103,
            message: 'Username atau password salah',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
};

const profile = (req, res) => {
    res.json({
        status: 0,
        message: 'Sukses',
        data: {
            userId: req.user.userId,
            email: req.user.email
        }
    });
};

module.exports = { login, profile };