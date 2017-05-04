const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'dagger.min.js',
        path: __dirname + '/dest'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    { loader: 'babel-loader?presets[]=es2015'}
                ]
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};