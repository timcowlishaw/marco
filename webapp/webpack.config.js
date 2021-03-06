const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: './src/js/main.js'
    },
    output:  {
        path: path.join(__dirname, '/dist/'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    target: 'web',
    devtool: 'source-map',
    module: {
        rules: [
            {

                test: /\.js$/,
                exclude: /node_modules/,
                use: { loader: 'babel-loader'}
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Marco",
            filename: "./index.html",
            template: "./src/templates/index.html"
        })
    ]
};
