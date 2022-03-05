const Joi = require('joi');

const UploadsSchema = Joi.object({
    mimetype: Joi.string().valid('image/png', 'image/jpg', 'image/jpeg', 'image/webp'),
}).unknown();

module.exports = { UploadsSchema };
