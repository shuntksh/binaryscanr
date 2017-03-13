/* tslint:disable */ 
"use strict";

const path = require("path");

const CheckerPlugin = require("awesome-typescript-loader").CheckerPlugin;
const TsConfigPathsPlugin = require("awesome-typescript-loader").TsConfigPathsPlugin;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

// For CSSNext
const cssnext = require("postcss-cssnext");
const cssnano = require("cssnano");
const reporter = require("postcss-reporter");
const stylefmt = require("stylefmt");
const stylelint = require("stylelint");

const plugins = () => ([
    stylefmt(),
    stylelint(),
    cssnext({
            browsers: [
            ">1%",
            "last 4 versions",
            "Firefox ESR",
            "not ie < 9",
        ],
    }),
    cssnano({ autoprefixer: false, reduceIdents: false }),
    reporter({ clearMessage: true, throwError: true }),
]);

const config = {
    target: "web",
    stats: true,
    entry: ["./client/app.tsx"],

    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"],
    },

    output: {
        path: path.resolve(process.cwd(), "./dist/static/"),
        publicPath: "/",
        filename: "[name].[chunkhash].js",
        sourceMapFilename: "[name].[chunkhash].map",
    },

    module: {
        rules: [
            { 
                test: /\.tsx?$/, 
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    emitErrors: true,
                    failOnHint: true,
                },
            
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png)$/,
                use: ['url-loader?limit=30000'],
            }
        ],
    },

    plugins: [
        new TsConfigPathsPlugin(),
        new ExtractTextPlugin({
            filename: "[name].[chunkhash].css",
            disable: false,
            allChunks: true,           
        }),
        new HtmlWebpackPlugin({
            template: "./client/index.html",
            inject: "body",
        }),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify(process.env.NODE_ENV).toLowerCase(),
            },
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                tslint: {
                    failOnHint: true,
                }
            }
        }),
    ],
};

//
// Production Configuration
//
if (process.env.NODE_ENV === "production") {
    config.bail = true;
    config.module.rules.push({
        test: /\.tsx?$/,
        use: ["awesome-typescript-loader"],
        exclude: /(\.spec.ts$|node_modules)/,
    });

    config.module.rules.push({
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
                { loader: "css-loader", options: { importLoaders: 1, camelCase: true }},
                { loader: "postcss-loader", options: { plugins }}
            ],
            publicPath: "/"
        }),
    });

    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: { screw_ie8: true },
        mangle: { screw_ie8: true },
        output: { comments: false, screw_ie8: true },
    }));

//
// Development Configuration
//
} else {
    // Include an alternative client for WebpackDevServer (for better error handling)
    config.entry.push(require.resolve("react-dev-utils/webpackHotDevClient"));
    config.output.filename = "[name].js";
    config.devtool = "cheap-module-source-map";
    config.module.rules.push({
        test: /\.tsx?$/,
        use: [
            { loader: "react-hot-loader" },
            { loader: "awesome-typescript-loader" },
        ],
        exclude: /(\.spec.ts$|node_modules)/,
    });
    // Using style-loader for react hot loader
    config.module.rules.push({
        test: /\.css$/,
        use: [
            { loader: "style-loader" },
            { loader: "css-loader", options: { 
                importLoaders: 1,
                camelCase: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
            }},
            { loader: "postcss-loader", options: { plugins }},
        ],
    });

    // Awesome-Typescript-Loader requires this to detect watch mode
    config.plugins.push(new CheckerPlugin());

    // Dev Server
    config.devServer = {
        contentBase: "./dev",
        hot: true,
        inline: true,
        historyApiFallback: true,
        host: "0.0.0.0",
        port: 8080,
        proxy: {
            "/api/*": {
                target: "http://localhost:3000",
            },
        },
    };
}

module.exports = config;
