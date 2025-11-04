const joi = require('joi');

const registration = joi.object({
    email: joi.string().email().required(),
    first_name: joi.string().min(3).max(30).required(),
    last_name: joi.string().min(3).max(30).required(),
    password: joi.string().min(8).required()
});

const login = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
});

const profileUpdate = joi.object({
    first_name: joi.string().min(3).required(),
    last_name: joi.string().min(3).required(),

});

const topup = Joi.object({
  top_up_amount: Joi.number().positive().required()
});

const transaction = Joi.object({
  service_code: Joi.string().required()
});

module.exports = {
    registration,
    login,
    profileUpdate,
    topup,
    transaction
};
