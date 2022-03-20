console.log("process.env.NODE_ENV: " + process.env.NODE_ENV);

const getEnvSettings = () => {
    global.g_envSettings = {
        isDev: undefined,
        isDevTestData: undefined,
        env: undefined
    }
    
    switch(process.env.NODE_ENV)
    {
        case 'development':
            {
                g_envSettings.isDev = true;
                g_envSettings.isDevTestData = false;
                g_envSettings.env = 'development';
                break;
            }
        case 'development-test-data':
            {
                g_envSettings.isDev = true;
                g_envSettings.isDevTestData = true;
                g_envSettings.env = 'development';
                break;
            }
        case 'production':
            {
                g_envSettings.isDev = false;
                g_envSettings.isDevTestData = false;
                g_envSettings.env = 'production';
                break;
            }
        default: {
            throw new Error('webpack.base.conf.js: Error unknown environment!');
        }
    }
}

getEnvSettings();
const isDev = global.g_envSettings.isDev,
    isDevTestData = global.g_envSettings.isDevTestData,
    envSettings = global.g_envSettings.env;

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseManifest = require("../public/manifest.json");
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
// Dotenv. Read the environment variables from the .env.
const Dotenv = require('dotenv-webpack');
let webpack = require("webpack");

const outPaths = {
    assets: 'assets'
};

// Main const
const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
    assets: 'assets/'
}
process.env.PUBLIC_URL = "/public";
const ASSET_PATH = process.env.ASSET_PATH;

//////////////////////////////////////////////////////////////////////////////////////////
///// File loader
//////////////////////////////////////////////////////////////////////////////////////////
// The file-loader resolves import/require() on a file into a url and emits the file into the output directory.
// This will emit file.png as a file in the output directory (with the specified naming convention, if options are specified to do so) and returns the public URI of the file.
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
//////////////////////////////////////////////////////////////////////////////////////////
///// Style loader
//////////////////////////////////////////////////////////////////////////////////////////
const styleLoader = isDev ? ['style-loader'] : [
    {
        loader: MiniCssExtractPlugin.loader,
    }
]
//////////////////////////////////////////////////////////////////////////////////////////
///// Style loader for static
//////////////////////////////////////////////////////////////////////////////////////////
const styleLoaderStatic = {
    loader: MiniCssExtractPlugin.loader,
};
//////////////////////////////////////////////////////////////////////////////////////////
///// CSS loader
//////////////////////////////////////////////////////////////////////////////////////////
const cssLoader = {
    loader: "css-loader",
    options: {
        import: true,
        importLoaders: 1,
        sourceMap: isDev ? true : false,
        modules: {
            localIdentName: isDev ? '[path]_[name]_[local]' : '[sha1:hash:hex:4]'
        }
    },
}
//////////////////////////////////////////////////////////////////////////////////////////
///// CSS loader for static
//////////////////////////////////////////////////////////////////////////////////////////
const cssLoaderStatic = {
    loader: "css-loader",
    options: {
        modules: "global",
        importLoaders: 1,
        sourceMap: isDev ? true : false,
    },
}
//////////////////////////////////////////////////////////////////////////////////////////
///// SASS loader
//////////////////////////////////////////////////////////////////////////////////////////
const sassLoader = {
    loader: "sass-loader",
    options: {
        sourceMap: isDev ? true : false
    }
}
//////////////////////////////////////////////////////////////////////////////////////////
///// Entry
//////////////////////////////////////////////////////////////////////////////////////////
const entryObject = {
    app: PATHS.src
};
//////////////////////////////////////////////////////////////////////////////////////////
///// Output
//////////////////////////////////////////////////////////////////////////////////////////
const outputObject = {
    filename: 'Saek0.js',
    path: PATHS.dist,
    publicPath: ASSET_PATH,
};
//////////////////////////////////////////////////////////////////////////////////////////
///// HtmlWebpackPlugin
//////////////////////////////////////////////////////////////////////////////////////////
const htmlPlugins = new HtmlWebpackPlugin({
    template: "./src/index.html",
    favicon: "./src/assets/img/ShizukaSystems-logo.ico",
    title: "ShizukaNews",
    meta: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
      "theme-color": "#000000"
    },
    manifest: "manifest.json",
    filename: "index.html",
    hash: true
});
//////////////////////////////////////////////////////////////////////////////////////////
///// ProvidePlugin plugin.
//////////////////////////////////////////////////////////////////////////////////////////
const pathDistJSJQuery = "jquery";
const providePlugin = new webpack.ProvidePlugin({
    $: pathDistJSJQuery,
    jQuery: pathDistJSJQuery,
    jquery: pathDistJSJQuery,
    "window.jQuery": pathDistJSJQuery
});
//////////////////////////////////////////////////////////////////////////////////////////
///// DefinePlugin
//////////////////////////////////////////////////////////////////////////////////////////
const definePlugin = new webpack.DefinePlugin({
    _DEBUG_: isDev,
    _TEST_DATA_: isDevTestData
});
//////////////////////////////////////////////////////////////////////////////////////////
///// Dotenv
//////////////////////////////////////////////////////////////////////////////////////////
const dotenvPlugin = new Dotenv(
    {
        path: `config/.env.${envSettings}`,
        expand: true
    }
);

module.exports = {
    externals: {
        paths: PATHS,
        jquery: pathDistJSJQuery,
        jQuery: pathDistJSJQuery
    },
    entry: entryObject,
    output: outputObject,
    devServer: {
        historyApiFallback: true,
    },
    module: {
        rules: [
            // JS modules.
            {
                test: /\.js$/i,
                exclude: /(node_modules|assets\\js\\static)/i,
                use: [
                    {
                        loader: "babel-loader",
                    }
                ]
            },
            // CSS static.
            {
                test: /assets\\css\\static\\(\S*).css$/i,
                use: [
                    styleLoaderStatic,
                    cssLoaderStatic
                ],
                include: [path.resolve(__dirname, `../src/${outPaths.assets}/css/static`)]
            },
            // CSS modules.
            {
                test: /\.css$/i,
                exclude: [path.resolve(__dirname, `../src/${outPaths.assets}/css/static`)],
                use: [
                    ...styleLoader,
                    cssLoader
                ],
            },
            // SCSS static.
            {
                test: /assets\\s[ac]ss\\static\\(\S*).s[ac]ss$/i,
                use: [
                    styleLoaderStatic,
                    cssLoaderStatic,
                    sassLoader
                ],
                include: [path.resolve(__dirname, `../src/${outPaths.assets}/scss/static`)]
            },
            // SCSS modules.
            {
                test: /\.s[ac]ss$/i,
                exclude: [path.resolve(__dirname, `../src/${outPaths.assets}/scss/static`)],
                use: [
                    ...styleLoader,
                    cssLoader,
                    sassLoader
                ]
            },
            // Images resource.
            {
                test: /\.(png|svg|jpg|gif)$/i,
                use: [
                    fileLoader(outPaths.assets + "/img")
                ]
            },
            // Fonts resource.
            {
                test: /\.(eot|woff|woff2|ttf|otf)([\?]?.*)$/,
                use: [
                    fileLoader(outPaths.assets + "/fonts")
                ]
            }
        ]
    },
    plugins: [
        htmlPlugins,
        new MiniCssExtractPlugin({
            chunkFilename: '[name].[contenthash].css',
        }),
        new FixStyleOnlyEntriesPlugin(),
        definePlugin,
        dotenvPlugin,
        providePlugin,
        new WebpackExtensionManifestPlugin({
            config: {
                base: baseManifest
            }
        })
    ],
    //// Add alias for path to folders.
    resolve:{
        alias:{
            src: PATHS.src,
            components: PATHS.src + "/components",
            services: PATHS.src + "/services",
            assets: PATHS.src + "/assets",
            scss: PATHS.src + "/assets/scss"
        },
    },
    //// Splitting out 3rd party libs into a separate .js file.
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: {
                    name: (module, chunks, cacheGroupKey) => {
                        const moduleFileName = module
                          .identifier()
                          .split('/')
                          .reduceRight((item) => item);
                          const allChunksNames = chunks.map((item) => {return `${item.name}.${item.hash}`});
                          return `${cacheGroupKey}-${allChunksNames}`;
                    },
                    priority: -10
                },
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: 'vendor',
                    enforce: true
                },
                staticjs: {
                    test: /assets\\js\\static/,
                    name: (module, chunks, cacheGroupKey) => {
                        const moduleFileName = module
                          .identifier()
                          .split('/')
                          .reduceRight((item) => item);
                          const allChunksNames = chunks.map((item) => {return `${item.name}.${item.hash}`});
                          return `${cacheGroupKey}-${allChunksNames}`;
                      },
                },
            }
        }
    }
};