"use strict";

const { CheckerPlugin } = require("awesome-typescript-loader");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OpenBrowserWebpackPlugin = require("open-browser-webpack-plugin");
const webpack = require("webpack");

// For CSSNext
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const stylefmt = require("stylefmt");
const stylelint = require("stylelint");

const config = {
    target: "web",
    stats: false,
    progress: true,

    entry: ["./src/client/app.tsx"],

    output: {
        path: "./dist/client/",
        publicPath: "",
        filename: "[name].[chunkhash].js",
        sourceMapFilename: "[name].[chunkhash].map",
    },

    resolve: {
        extensions: ["", ".ts", ".tsx", ".js"],
    },

    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                loader: "tslint-loader",
            },
        ],

        loaders: [
            {
                test: /\.css$/,
                // loader: "style!css?modules&importLoaders=1&camelCase!postcss",
                loader: ExtractTextPlugin.extract("css?modules&importLoaders=1&camelCase!postcss")
            },
        ],
    },

    plugins: [
        new ExtractTextPlugin("[name].[chunkhash].css"),
        new HtmlWebpackPlugin({
            template: "./src/client/index.html",
            inject: "body",
        }),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify(process.env.NODE_ENV).toLowerCase(),
            },
        }),
    ],

    postcss: () => [
        cssnano(),
        stylefmt(),
        stylelint(),
        autoprefixer({
            browsers: [
                ">1%",
                "last 4 versions",
                "Firefox ESR",
                "not ie < 9",
            ],
        }),
    ],

    tslint: {
        failOnHint: true,
    },
};

//
// Production Configuration
//
if (process.env.NODE_ENV === "production") {
    config.bail = true;
    config.debug = false;
    config.module.loaders.push({
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        exclude: /(\.spec.ts$|node_modules)/,
    });
    config.plugins.push(new webpack.optimize.DedupePlugin());
    config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            screw_ie8: true,
            warnings: false,
        },
        mangle: {
            screw_ie8: true,
        },
        output: {
            comments: false,
            screw_ie8: true,
        },
    }));

//
// Development Configuration
//
} else {
    // Include an alternative client for WebpackDevServer (for better error handling)
    config.entry.push(require.resolve("react-dev-utils/webpackHotDevClient"));

    config.output.filename = "[name].js";
    config.module.loaders.push({
        test: /\.tsx?$/,
        loader: "react-hot!awesome-typescript-loader",
        exclude: /(\.spec.ts$|node_modules)/,
    });

    // Awesome-Typescript-Loader requires this to detect watch mode
    config.plugins.push(new CheckerPlugin());

    // Dev Server
    config.devtool = "cheap-module-source-map";
    // config.plugins.push(new OpenBrowserWebpackPlugin({
    //     url: "http://localhost:8080/",
    // }));
    config.devServer = {
        contentBase: "./dev",
        hot: true,
        inline: true,
        host: "0.0.0.0",
        port: 8080,
    };

    // Learn from create-react-app project.
    config.node = {
        fs: "empty",
        net: "empty",
        tls: "empty",
    };
}

module.exports = config;
