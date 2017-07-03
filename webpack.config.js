const webpack = require('webpack');
const path = require('path');


module.exports = {
    entry: {
        example:  './example/index.js',
        playground: './playground/index.js'
    },
    output: {
        filename: '[name].min.js',
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
    ],
    watch: true,
    devServer: {
        contentBase: path.join(__dirname, "example"),
        compress: true,
        port: 9000,
        inline: true
    }   
};