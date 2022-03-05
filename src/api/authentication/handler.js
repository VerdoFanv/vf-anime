class AuthenticationHandler {
    constructor(service, validator, autoBind) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async getAuthenticationHandler(req, res) {
        const errorMessage = null;

        res.render('login', {
            errorMessage,
            message: req.flash('errorAuthentication'),
            page_title: 'Login - Page',
        });
    }

    async postAuthenticationHandler(req, res) {
        try {
            this._validator.validateAuthenticationPayload(req.body);

            const { username, password } = req.body;
            const { id, new_username } = await this._service.verifyUserCrendential(username, password);

            req.session.userId = id;
            req.session.username = new_username;

            res.redirect('/');
        } catch (e) {
            const errorMessage = e.message;

            req.flash('errorAuthentication', errorMessage);
            res.redirect('/login');
        }
    }
}

module.exports = AuthenticationHandler;
