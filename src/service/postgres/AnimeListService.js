const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const moment = require('moment');
const lists = require('../../data/allList');

class AnimeListService {
    constructor() {
        this._pool = new Pool();
    }

    async addAnimeList({
        img, title, year, genres, desc, rate,
    }) {
        const id = `anime-${nanoid(16)}`;
        const imgName = (img === 'default.png') ? 'default.png' : `${nanoid(12)}-${img}`;
        const createdAt = `${moment({}).utcOffset(7)}`;
        const query = {
            text: 'INSERT INTO anime_lists VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8) RETURNING id',
            values: [id, imgName, title, year, genres, desc, rate, createdAt],
        };

        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
            throw new Error('Anime gagal ditambahkan');
        }

        return imgName;
    }

    async addListGenre(genres) {
        const query = {
            text: 'INSERT INTO genres VALUES ($1)',
            values: [genres],
        };

        const result = await this._pool.query(query);
        if (!result.rows) {
            throw new Error('Anime genre gagal ditambahkan');
        }
    }

    async getAnimeList() {
        const query = 'SELECT * FROM anime_lists';
        const result = await this._pool.query(query);

        return result.rows;
    }

    async getAnimeListById(id) {
        const query = {
            text: `SELECT * FROM anime_lists
                WHERE id = $1
            `,
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new Error('Gagal mendapatkan anime, id tidak ditemukan');
        }

        return result.rows[0];
    }

    async addGenres(genres) {
        const query = {
            text: 'INSERT INTO genres VALUES ($1)',
            values: [genres],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new Error('Gagal menambahkan genre');
        }
    }

    async getListGenres() {
        const query = 'SELECT all_genre FROM genres ORDER BY all_genre ASC';
        const result = await this._pool.query(query);

        if (result.rows.length < 1) {
            const genresData = ['action', 'adventure', 'cars', 'comedy', 'crime', 'demons', 'drama', 'ecchi', 'fantasy', 'game', 'harem', 'historical', 'horror', 'josei', 'kids', 'magic', 'martial arts', 'mecha', 'military', 'music', 'mystery', 'parody', 'police', 'psychological', 'romance', 'samurai', 'school', 'sci-fi', 'shoujou', 'shoujou AI', 'shounen', 'shounen AI', 'slice of life', 'space', 'sports', 'super power', 'supernatural', 'suspense', 'thriller', 'vampire', 'yaoi', 'yuri'];

            this.addGenres(genresData);

            const newQuery = 'SELECT all_genre FROM genres ORDER BY all_genre ASC';
            const newResult = await this._pool.query(newQuery);

            return newResult.rows[0].all_genre;
        } else {
            return result.rows[0].all_genre;
        }
    }

    async deleteAnimeListById(id) {
        const query = {
            text: `DELETE FROM anime_lists
                WHERE id = $1
            `,
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new Error('Gagal menhapus anime, id tidak ditemukan');
        }
    }

    getDummyAnimeList() {
        return lists;
    }
}

module.exports = AnimeListService;
