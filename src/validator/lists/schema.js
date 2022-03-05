const Joi = require('joi');

const listSchema = Joi.object({
    img: Joi.string(),
    title: Joi.string().required(),
    year: Joi.number().integer().min(1950).required(),
    genres: Joi.array().required(),
    desc: Joi.string().required(),
    rate: Joi.number().required(),
});

module.exports = { listSchema };
