const path = require('path');
const autoBind = require('auto-bind');
const momentJs = require('moment');

const routes = require('./routes');
const ListHandler = require('./handler');
const AnimeListService = require('../../service/postgres/AnimeListService');
const UploadsService = require('../../service/uploads/UploadsService');
const uploadsValidator = require('../../validator/uploads');
const listValidator = require('../../validator/lists');

const listControler = {
    execute(app) {
        const animeListService = new AnimeListService();
        const uploadsService = new UploadsService(path.resolve(__dirname, 'upload'));
        const listHandler = new ListHandler({
            respositoryService: animeListService,
            uploadsService,
            uploadsValidator,
            listValidator,
            autoBind,
            momentJs,
        });

        routes(app, listHandler);
    },
};

module.exports = listControler;
