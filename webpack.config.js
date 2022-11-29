const path = require('path');

const config = {
    entry: './src/index.js',
    watch: true,
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    }
};

module.exports = config;