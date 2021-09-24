const isDev = process.env.NODE_ENV === 'development';
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const SocialTags = require('social-tags-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const getScopedName = require('./getScopedName');
const resolve = relativePath => path.resolve(__dirname, relativePath);

// Main const
// see more: https://github.com/vedees/webpack-template/blob/master/README.md#main-const
const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
    assets: 'assets/'
}

process.env.PUBLIC_URL = "/public";

const ASSET_PATH = process.env.ASSET_PATH; // || '/' || "/public";

// const styleLoader = isDev ? ['style-loader'] : [
//     resolve('./webpack-loaders/nullLoader'),
//     MiniCssExtractPlugin.loader,
// ]

// const styleLoader = isDev ? ['style-loader'] : [
//     resolve('./webpack-loaders/nullLoader'),
//     {
//         loader: MiniCssExtractPlugin.loader,
//     }
// ]

const styleLoader = isDev ? ['style-loader'] : [
    // resolve('./webpack-loaders/nullLoader'),
    {
        loader: MiniCssExtractPlugin.loader,
    }
]

//PATHS.assets + "/img"
const fileLoader = (outPath) => {
    return (
        {
            loader: "file-loader",
            options: {
                outputPath: outPath
            }
        }
    );
}

const cssLoader = {
    loader: "css-loader",
    options: {
        import: true,
        modules: true,
        importLoaders: 1,
        sourceMap: isDev ? true : false,
        modules: {
            localIdentName: isDev ? '[path]_[name]_[local]' : '[sha1:hash:hex:4]'

            // ...(isDev ? {
            //     localIdentName: '[path]_[name]_[local]',
            //     } : {
            //     getLocalIdent: (context, localIdentName, localName) => (
            //         getScopedName(localName, context.resourcePath)
            //     ),
            // })
        }
    },
}

const sassLoader = {
    loader: "sass-loader",
    options: {
        sourceMap: isDev ? true : false
    }
}

module.exports = {
    externals: {
        paths: PATHS
    },
    entry: {
        app: PATHS.src
    },
    output: {
        filename: 'Saek0.js',
        path: PATHS.dist,
        publicPath: ASSET_PATH,
    },
    devServer: {
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    fileLoader(PATHS.assets + "/css"),
                    ...styleLoader,
                    cssLoader
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    ...styleLoader,
                    cssLoader,
                    sassLoader
                ]
            },
            // fileLoader(/\.(png|svg|jpg|gif)$/, PATHS.assets + "/img")
            {
                test: /\.(png|svg|jpg|gif)$/,
                // use: [
                //     'file-loader'
                // ]
                use: [
                    fileLoader(PATHS.assets + "/img")
                    // {
                    //     loader: "file-loader",
                    //     options: {
                    //         outputPath: PATHS.assets + "/img"
                    //     }
                    // }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            favicon: "./src/assets/img/ShizukaSystems-logo.ico",
        }),
        // new SocialTags(
        //     {
        //         // appUrl: 'http://example.com/',
        //         facebook: {
        //           'fb:app_id': "123456789",
        //         //   'og:url': "http://example.com/page.html",
        //           'og:type': "website",
        //           'og:title': "Shizuka news aggregator",
        //           'og:image': './src/assets/img/ShizukaNews-signboard.png',
        //           'og:image:width': "968",
        //           'og:image:height': "504",
        //           'og:description': "Headlines and news from around the world",
        //           'og:site_name': "Shizuka News",
        //           'og:locale': "en_US",
        //           'og:article:author': "",
        //         },
        //         twitter: {
        //           "twitter:card": "summary_large_image",
        //           "twitter:site": "@M3ikShizuka",
        //           "twitter:creator": "@M3ikShizuka",
        //         //   "twitter:url": "http://example.com/page.html",
        //           "twitter:title": "Shizuka news aggregator",
        //           "twitter:description": "Headlines and news from around the world",
        //           "twitter:image": './src/assets/img/ShizukaNews-signboard.png',
        //           "twitter:image:src": './src/assets/img/ShizukaNews-signboard.png',
        //         },
        //     }
        // ),
        new CopyPlugin(
            {
                patterns: [
                    { from: 'src/static/img/', to: PATHS.assets + '/img/' },
                ],
            }
        ),
        ...(isDev ? [] : [
            new MiniCssExtractPlugin({
              filename: '[name].[contenthash].css',
              chunkFilename: '[name].[contenthash].css',
            }),
          ]),
    ]
};