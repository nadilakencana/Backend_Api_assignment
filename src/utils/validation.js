const joi = require('joi');

const registrationSchema = joi.object({
    email: joi.string().email().required(),
    first_name: joi.string().min(3).max(30).required(),
    last_name: joi.string().min(3).max(30).required(),
    password: joi.string().min(8).required()
})