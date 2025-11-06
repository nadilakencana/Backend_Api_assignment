const joi = require('joi');

const registrationSchema = joi.object({
    email: joi.string().email().required(),
    first_name: joi.string().min(3).max(30).required(),
    last_name: joi.string().min(3).max(30).required(),
    password: joi.string().min(8).required()
});

const loginSchema = joi.object({
    email: joi.string().email().required().messages({
        'string.email': 'Parameter email tidak sesuai format',
        'any.required': 'Parameter email harus diisi'
    }),
    password: joi.string().min(8).required().messages({
        'string.min': 'Password minimal 8 karakter',
        'any.required': 'Parameter password harus diisi'
    })
});

const profileUpdateSchema = joi.object({
    first_name: joi.string().min(3).required(),
    last_name: joi.string().min(3).required(),

});

const profileImageUpdateSchema = joi.object({
    profile_image: joi.string().pattern(/\.(jpeg|png)$/i).required().messages({
        'string.pattern.base': 'Format Image tidak sesuai'
    })
});

const topupSchema = joi.object({
  top_up_amount: joi.number().positive().required()
});

const transactionSchema = joi.object({
  service_code: joi.string().required()
});

module.exports = {
    registrationSchema,
    loginSchema,
    profileUpdateSchema,
    profileImageUpdateSchema,
    topupSchema,
    transactionSchema
};
