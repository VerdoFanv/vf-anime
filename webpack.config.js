const path = require('path');

module.exports = {
    entry: './src/public/js/App.js',
    output: {
        path: path.resolve(__dirname, 'src/public/js/'),
        filename: 'main-script.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                        },
                    },
                ],
            },
        ],
    },
    plugins: [],
};
