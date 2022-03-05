const autoBind = require('auto-bind');
const routes = require('./routes');
const AuthenticationHandler = require('./handler');
const UsersService = require('../../service/postgres/UsersService');
const authenticationValidator = require('../../validator/authentication');

const authentication = {
    execute(app) {
        const usersService = new UsersService();
        const authenticationHandler = new AuthenticationHandler(usersService, authenticationValidator, autoBind);

        routes(app, authenticationHandler);
    },
};

module.exports = authentication;
