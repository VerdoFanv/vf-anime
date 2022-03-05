exports.up = (pgm) => {
    pgm.createTable('genres', {
        all_genre: {
            type: 'TEXT[]',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('genres');
};
