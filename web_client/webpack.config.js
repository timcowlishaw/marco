const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['./js/main.js'],
    output:  {
        path: __dirname + '/dist/',
        filename: 'bundle.js'
    },
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
            template: "./templates/index.html"
        })
    ]
};
