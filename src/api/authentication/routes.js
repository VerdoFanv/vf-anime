const routes = (app, handler) => {
    app.get('/login', handler.getAuthenticationHandler);
    app.post('/login', handler.postAuthenticationHandler);
};

module.exports = routes;
