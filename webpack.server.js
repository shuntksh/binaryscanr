/* tslint:disable */ 
"use strict";

const { CheckerPlugin } = require("awesome-typescript-loader");
const fs = require('fs');
const path = require('path');
const webpack = require("webpack");

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });


const config = {
    target: "node",
    stats: false,
    progress: true,

    entry: ["./src/server/binaryscanr.ts"],

    output: {
        path: "./dist/",
        publicPath: "/",
        filename: "binaryscanr.js",
        sourceMapFilename: "binaryscanr.map",
    },

    resolve: {
        extensions: ["", ".ts", ".tsx", ".js", ".json"],
    },

    externals: nodeModules,

    module: {
        preLoaders: [
            { test: /\.ts$/, loader: "tslint" },
        ],

        loaders: [
            { test: /\.json$/, loader: "json" },
            { test: /\.ts$/, loader: "awesome-typescript", exclude: /(\.spec.ts$|node_modules)/ },
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
//
// Development Configuration
//
} else {
    config.bail = true;
    config.debug = true;

    // Include an alternative client for WebpackDevServer (for better error handling)
    config.devtool = "cheap-module-source-map";

    // Awesome-Typescript-Loader requires this to detect watch mode
    config.plugins.push(new CheckerPlugin());
}

module.exports = config;
