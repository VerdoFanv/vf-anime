class ListHandler {
    constructor({
        respositoryService, uploadsService, uploadsValidator, listValidator, autoBind, momentJs,
    }) {
        this._respositoryService = respositoryService;
        this._uploadsService = uploadsService;
        this._uploadsValidator = uploadsValidator;
        this._listValidator = listValidator;
        this._momentJs = momentJs;

        this._animeGenres = '';

        autoBind(this);
    }

    async postListHandler(req, res) {
        try {
            const imgUpload = (req.files === null || req.files === undefined) ? { name: 'default.png', mimetype: 'image/png' } : req.files.img_upload;

            const newObjectPayload = {
                img: imgUpload.name,
                title: (req.body.anime_title === '' || req.body.anime_title === undefined) ? 'Untitled' : req.body.anime_title,
                year: (req.body.anime_year === '' || req.body.anime_year === undefined) ? (new Date().getFullYear()) : req.body.anime_year,
                genres: (this._animeGenres.length < 1) ? ['None Description...'] : this._animeGenres,
                desc: (req.body.anime_desc === '' || req.body.anime_desc === undefined) ? 'None...' : req.body.anime_desc,
                rate: (req.body.anime_rate === '' || req.body.anime_rate === undefined) ? 9.5 : req.body.anime_rate,
            };

            this._listValidator.validateListPayload(newObjectPayload);
            this._uploadsValidator.validateUploadsPayload(imgUpload);

            const imgName = await this._respositoryService.addAnimeList(newObjectPayload);

            if (req.files !== null && req.files !== undefined) {
                this._uploadsService.uploadFile(imgUpload, imgName);
            }

            res.redirect('/');
        } catch (e) {
            console.log(e.message);
            res.redirect('/');
        }
    }

    async getListHandler(req, res) {
        const lists = await this._respositoryService.getAnimeList();
        const genres = await this._respositoryService.getListGenres();

        return res.render('index', {
            lists, listGenres: genres, page_title: 'VF Anime', moment: this._momentJs,
        });
    }

    async getListByIdHandler(req, res) {
        try {
            const animeId = req.query.id;
            const getAnime = await this._respositoryService.getAnimeListById(animeId);

            const message = {
                status: 200,
                message: 'Berhasil mendapatkan id',
                body: getAnime,
            };

            res.status(200);
            res.send(message);
        } catch (e) {
            const message = {
                status: 404,
                message: e.message,
            };

            res.status(404);
            res.send(message).end();
        }
    }

    async deleteListByIdHandler(req, res) {
        try {
            const animeId = (req.params.id).slice(0, req.params.id.length - 1);
            await this._respositoryService.deleteAnimeListById(animeId);
            this._uploadsService.deleteFile(req.params.files);

            res.status(200);
            res.send({
                status: 200,
                message: 'Berhasil menghapus anime',
            });
        } catch (e) {
            const message = {
                status: 404,
                message: e.message,
            };

            res.status(404);
            res.send(message).end();
        }
    }

    async editListByIdHandler(req, res) {
        try {
            console.log(req.query.id);
        } catch (e) {
            const message = {
                status: 404,
                message: e.message,
            };

            res.status(404);
            res.send(message).end();
        }
    }

    async getListGenres(req, res) {
        try {
            const genres = await this._respositoryService.getListGenres();

            const message = {
                status: 200,
                message: 'Berhasil mendapatkan genre',
                body: genres,
            };

            res.status(200);
            res.send(JSON.stringify(message));
        } catch (error) {
            const message = {
                status: 404,
                message: error.message,
            };

            res.status(400);
            res.send(message);
        }
    }

    _postGenres(req, res) {
        try {
            this._animeGenres = req.body.anime_genres;

            const message = {
                status: 201,
                message: 'Berhasil menambahkan genre',
            };

            res.status(201);
            res.send(message);
        } catch (e) {
            const message = {
                status: 400,
                message: e.message,
            };

            res.status(400);
            res.send(message);
        }
    }

    _logoutHandler(req, res) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
}

module.exports = ListHandler;
