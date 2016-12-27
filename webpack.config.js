"use strict";

const { CheckerPlugin } = require("awesome-typescript-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OpenBrowserWebpackPlugin = require("open-browser-webpack-plugin");
const postcssCssNext = require("postcss-cssnext");
const postcssReporter = require("postcss-reporter");
const webpack = require("webpack");

const config = {
    target: "web",
    stats: false,
    progress: true,

    entry: "./src/client/app.tsx",

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
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css?modules&importLoaders=1&camelCase!postcss",
            },
        ],
    },

    plugins: [
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
        postcssCssNext({ browsers: ["last 2 versions", "IE > 10"] }),
        postcssReporter({ clearMessages: true }),
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
    config.plugins.push(new webpack.optimize.DedupePlugin());
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

    // Awesome-Typescript-Loader requires this to detect watch mode
    config.plugins.push(new CheckerPlugin());

    // Dev Server
    config.devtool = "#cheap-module-source-map";
    // config.plugins.push(new OpenBrowserWebpackPlugin({
    //     url: "http://localhost:8081/",
    // }));
    config.devServer = {
        contentBase: "./dev",
        hot: true,
        inline: true,
        host: "0.0.0.0",
        port: 8081,
    };
}

module.exports = config;
