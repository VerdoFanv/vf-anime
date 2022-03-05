require('dotenv').config();

class UsersHandler {
    constructor(service, validator, autoBind) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    authCreateHandler(req, res) {
        res.render('authCreate', {
            page_title: 'Authentication for Create Account - Page',
            message: req.flash('errorMessage'),
        });
    }

    async postAuthCreateHandler(req, res) {
        if (req.body.password === process.env.API_ACCESS_KEY) {
            req.session.isAuthSuccess = true;
            res.redirect('/create');
        } else {
            req.session.isAuthSuccess = false;
            req.flash('errorMessage', 'Password salah!');
            res.redirect('/authCreate');
        }
    }

    renderCreatePage(req, res) {
        if (req.session.isAuthSuccess === true) {
            res.render('create', { page_title: 'Create Account - Page' });
        } else {
            res.redirect('/authCreate');
        }
    }

    async postUserHandler(req, res) {
        try {
            this._validator.validateAddUsersSchema(req.body);

            const { username, email, password } = req.body;
            await this._service.addUser({ username, email, password });

            res.redirect('/login');
        } catch (e) {
            res.redirect('/authCreate');
        }
    }

    async deleteUserHandler(req, res) {
        try {
            await this._service.deleteUserById(req.body.id);

            const message = {
                status: 201,
                message: 'Berhasil menghapus user',
            };

            res.status(201);
            res.send(message).end();
        } catch (e) {
            const message = {
                status: 404,
                message: e.message,
            };

            res.status(404);
            res.send(message).end();
        }
    }
}

module.exports = UsersHandler;
