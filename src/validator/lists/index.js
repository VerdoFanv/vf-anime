const { listSchema } = require('./schema');

const listValidator = {
    validateListPayload(payload) {
        const validationResult = listSchema.validate(payload);
        if (validationResult.error) {
            throw new Error('Data yang diberikan tidak valid');
        }
    },
};

module.exports = listValidator;
