const routes = (app, handler) => {
    app.post('/', handler.postListHandler);
    app.get('/', handler.getListHandler);
    app.get('/anime?:id', handler.getListByIdHandler);
    app.delete('/deleteAnime/:id/:files', handler.deleteListByIdHandler);
    app.put('/editAnime?:id', handler.editListByIdHandler);
    app.post('/addGenres', handler._postGenres);
    app.get('/logout', handler._logoutHandler);
    app.get('/getGenres', handler.getListGenres);
};

module.exports = routes;
