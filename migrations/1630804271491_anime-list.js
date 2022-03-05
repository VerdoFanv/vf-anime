exports.up = (pgm) => {
    pgm.createTable('anime_lists', {
        id: {
            type: 'VARCHAR(60)',
            primaryKey: true,
        },
        img: {
            type: 'TEXT',
            notNull: true,
        },
        title: {
            type: 'VARCHAR(200)',
            notNull: true,
        },
        year: {
            type: 'INT',
            notNull: true,
        },
        genres: {
            type: 'TEXT[]',
            notNull: true,
        },
        desc: {
            type: 'TEXT',
            notNull: true,
        },
        rate: {
            type: 'TEXT',
            notNull: true,
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('anime_lists');
};
