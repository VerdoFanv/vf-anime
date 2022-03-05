const { UploadsSchema } = require('./schema');

const uploadsValidator = {
    validateUploadsPayload(payload) {
        const validatrionResult = UploadsSchema.validate(payload);
        if (validatrionResult.error) {
            throw new Error('File tidak diizinkan');
        }
    },
};

module.exports = uploadsValidator;
