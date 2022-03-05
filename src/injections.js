// api
const lists = require('./api/lists');
const authentication = require('./api/authentication');
const users = require('./api/users');

const useCaseContainer = [
    lists,
    authentication,
    users
];

module.exports = useCaseContainer;