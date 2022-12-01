const path = require('path');

const config = {
    entry: './src/index.js',
    mode: process.env.MODE || 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    }
};

module.exports = config;