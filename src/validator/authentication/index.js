const { authenticationSchema } = require('./schema');

const authenticationValidator = {
    validateAuthenticationPayload(payload) {
        const validationResult = authenticationSchema.validate(payload);

        if (validationResult.error) {
            throw new Error('Kredensial yang dibutuhkan tidak sesuai!');
        }
    },
};

module.exports = authenticationValidator;
