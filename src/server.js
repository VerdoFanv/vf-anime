require('dotenv').config();

// packages
const express = require('express');
const path = require('path');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const flash = require('connect-flash');
const redis = require('redis');
const connectRedis = require('connect-redis');
const cookieParser = require('cookie-parser');

const RedisStore = connectRedis(session);
const useCaseContainer = require('./injections');

// const redisConfig1 = (process.env.NODE_ENV === 'production') ? { url: process.env.REDIS_URL } : { host: process.env.REDIS_HOST };
const redisConfig2 = (process.env.NODE_ENV === 'production') ? { host: process.env.REDIS_HOST, auth_pass: process.env.REDIS_PASSWORD } : { host: process.env.REDIS_HOST };

const redisClient = redis.createClient(redisConfig2);
redisClient.on('error', (error) => {
    console.log(`Gagal melakukan koneksi dengan redis ${error}`);
});
redisClient.on('connect', () => {
    console.log('Berhasil terkoneksi dengan redis');
});

const app = express();

app.set('trust proxy', 1);

app.use(
    express.urlencoded({ extended: true }),
    express.json(),
    express.static(path.resolve(__dirname, 'public')),
    express.static(path.resolve(__dirname, 'api/lists')),
    session({
        store: new RedisStore({
            client: redisClient,
            ttl: 1 * 60 * 60,
        }),
        cookie: {
            httpOnly: false,
            signed: true,
            maxAge: 60 * 60 * 60,
        },
        secret: `${process.env.SECRET_KEY}`,
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
    }),
    fileUpload(),
    flash(),
    cookieParser(),
);

app.use((req, res, next) => {
    if (req.session.userId !== undefined) {
        res.locals.username = req.session.username;
        res.locals.isLoggedIn = true;
    }

    next();
});

app.set('views', path.resolve(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

// middleware execution
useCaseContainer.forEach((useCase) => {
    useCase.execute(app);
});

// server listener
app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`apps berjalan pada https://${process.env.HOST}:${process.env.PORT}`);
});
