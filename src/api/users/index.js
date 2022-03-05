const autoBind = require('auto-bind');
const routes = require('./routes');
const UsersHandler = require('./handler');
const UsersService = require('../../service/postgres/UsersService');
const usersValidator = require('../../validator/users');

const users = {
    execute(app) {
        const usersService = new UsersService();
        const usersHandler = new UsersHandler(usersService, usersValidator, autoBind);

        routes(app, usersHandler);
    },
};

module.exports = users;
