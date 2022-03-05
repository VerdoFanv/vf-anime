const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const moment = require('moment');

class UsersService {
    constructor() {
        this._pool = new Pool();
    }

    async addUser({ username, email, password }) {
        await this._verifyExistUser(username);

        const id = `user-${nanoid(12)}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = `${moment({}).utcOffset(7)}`;
        const query = {
            text: 'INSERT INTO users VALUES ($1, $2, $3, $4, $5, $5) RETURNING id',
            values: [id, username, hashedPassword, email, createdAt],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new Error('User baru gagal ditambahkan');
        }
    }

    async editUserById(id, { username, password }) {
        const query = {
            text: 'UPDATE users SET username = $1, password = $2 WHERE id = $3',
            values: [username, password, id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new Error('Gagal menghapus user, id tidak ditemukan');
        }
    }

    async deleteUserById(id) {
        const query = {
            text: 'DELETE FROM users WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new Error('Gagal menghapus user, id tidak ditemukan');
        }
    }

    async _verifyExistUser(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        };

        const result = await this._pool.query(query);

        if (result.rowCount > 0) {
            throw new Error('Gagal menambahkan User baru, Username sudah ada');
        }
    }

    async verifyUserCrendential(username, password) {
        if (username === '' && password === '') {
            throw new Error('Username & Password tidak diisi');
        }

        const query = {
            text: 'SELECT id, username AS new_username, password FROM users WHERE username = $1',
            values: [username],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new Error('Username salah!');
        }

        const { id, new_username, password: hashedPassword } = result.rows[0];
        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new Error('Password salah!');
        }

        return { id, new_username };
    }
}

module.exports = UsersService;
