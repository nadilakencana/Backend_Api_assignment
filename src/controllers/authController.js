const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { registrationSchema, loginSchema } = require('../utils/validation');


const regist = async (req, res) =>{
    try{
        
        const{error} = registrationSchema.validate(req.body);
        if(error){
            return res.status(400).json({
                status: 102,
                message: 'Paramter email tidak sesuai format',
                data: null
            });
        }

        const{email,first_name, last_name, password} = req.body;

        const existingUser = await User.findByEmail(email);
        if(existingUser){
            return res.status(409).json({
                status: 409,
                message: 'Email sudah terdaftar',
                data: null
            });
        
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            email,
            first_name,
            last_name,
            password: hashedPassword
        });

        res.status(200).json({
            status: 0,
            message: "Registrasi berhasil silahkan login",
            data: null
        });
    }catch(error){
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
        const{error} = loginSchema.validate(req.body);
        if (error){
            return res.status(400).json({
                status: 102,
                message: 'Parameter email atau password tidak sesuai format',
                data: null
            });
        }

        const { email, password } = req.body;
        
        const user = await User.findByEmail(email);
        if(!user){
            return res.status(401).json({
                status: 103,
                message: 'Username atau password salah',
                data: null
            });
        }


        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword){
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
            data: {
                token
            }
        });


    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
};



module.exports = { regist ,login };