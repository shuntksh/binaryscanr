"use strict";

const { CheckerPlugin } = require("awesome-typescript-loader");
const webpack = require("webpack");

const config = {
    target: "node",
    stats: false,
    progress: true,

    entry: ["./src/server/index.ts"],

    output: {
        path: "./dist/",
        publicPath: "/",
        filename: "binaryscanr.js",
        sourceMapFilename: "binaryscanr.map",
    },

    resolve: {
        extensions: ["", ".ts", ".tsx", ".js", ".json"],
    },

    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                loader: "tslint",
            },
        ],

        loaders: [
            {
                test: /\.json$/,
                loader: "json",
            },
            {
                test: /\.ts$/,
                loader: "awesome-typescript",
                exclude: /(\.spec.ts$|node_modules)/,
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify(process.env.NODE_ENV).toLowerCase(),
            },
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
    config.devtool = "cheap-module-source-map";

    // Awesome-Typescript-Loader requires this to detect watch mode
    config.plugins.push(new CheckerPlugin());
}

module.exports = config;
