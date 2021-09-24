process.env.NODE_ENV = 'development';

const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const buildWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        static: baseWebpackConfig.externals.paths.dist,
        port: 3000,
        client: {
            overlay: {
                warnings: true,
                errors: true
            }
        }
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ]
})

module.exports = new Promise((resolve, reject) => {
    resolve(buildWebpackConfig)
})