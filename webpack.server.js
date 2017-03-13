/* tslint:disable */ 
"use strict";

const CheckerPlugin = require("awesome-typescript-loader").CheckerPlugin;
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
    stats: true,

    entry: ["./server/binaryscanr.ts"],

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
    },

    output: {
        path: path.resolve(process.cwd(), "./dist/"),
        publicPath: "/",
        filename: "binaryscanr.js",
        sourceMapFilename: "binaryscanr.map",
        library: "binaryscanr",
        libraryTarget: "commonjs2",
    },

    externals: nodeModules,

    module: {
        rules: [
            { test: /\.ts$/, enforce: "pre", loader: "tslint-loader" },
            { test: /\.json$/, use: "json-loader" },
            { test: /\.ts$/, loader: "awesome-typescript-loader", exclude: /(\.spec.ts$|node_modules)/ },
        ],
    },

    plugins: [
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

//
// Development Configuration
//

} else {
    config.bail = true;

    // Include an alternative client for WebpackDevServer (for better error handling)
    config.devtool = "cheap-module-source-map";

    // Awesome-Typescript-Loader requires this to detect watch mode
    config.plugins.push(new CheckerPlugin());
}

module.exports = config;
