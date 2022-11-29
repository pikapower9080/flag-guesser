const path = require('path');

const config = {
    entry: './src/index.js',
    watch: true,
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    }
};

module.exports = config;