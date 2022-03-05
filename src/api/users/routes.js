const routes = (app, handler) => {
    app.get('/authCreate', handler.authCreateHandler);
    app.post('/authCreate', handler.postAuthCreateHandler);
    app.get('/create', handler.renderCreatePage);
    app.post('/create', handler.postUserHandler);
    // app.get('/getUserByUsername', handler.getUserByUsernameHandler);
    // app.edit('/editUser', handler.editUserHandler);
    app.delete('/deleteUser', handler.deleteUserHandler);
};

module.exports = routes;
