"use strict";

const { CheckerPlugin } = require("awesome-typescript-loader");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OpenBrowserWebpackPlugin = require("open-browser-webpack-plugin");

const config = {
    target: "web",
    stats: false,
    progress: true,
    entry: "./src/client/index.tsx",
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
        loaders: [],
    },

    plugins: [
        new HtmlWebpackPlugin({ template: "./src/client/index.html", inject: "body" }),
        new webpack.optimize.DedupePlugin(),
        new CheckerPlugin(),
        new webpack.DefinePlugin({
            "process.env": { "NODE_ENV": JSON.stringify(process.env.NODE_ENV) },
        }),
    ],
};

//
// Production Configuration
//
if (process.env.NODE_ENV === "production") {
    config.debug = false;
    config.module.loaders.push({
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        exclude: /(\.spec.ts$|node_modules)/,
    });
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            screw_ie8: true,
            warnings: false,
        },
    }));

//
// Development Configuration
//
} else {
    config.output.filename = "[name].js";

    config.module.loaders.push({
        test: /\.tsx?$/,
        loader: "react-hot!awesome-typescript-loader",
        exclude: /(\.spec.ts$|node_modules)/,
    });
    config.plugins.push(new OpenBrowserWebpackPlugin({
        url: "http://localhost:8081/",
    }));
    config.devtool = "#cheap-module-source-map";
    config.devServer = {
        contentBase: "./dev",
        hot: true,
        inline: true,
        host: "0.0.0.0",
        port: 8081,
    };
}

module.exports = config;
