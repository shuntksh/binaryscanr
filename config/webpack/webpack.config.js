/*tslint:disable*/

"use strict";

const { CheckerPlugin } = require("awesome-typescript-loader")
const webpack = require("webpack");

const config = {
  target: "web",
  stats: false,
  progress: true,

  entry: "./src/client/index.tsx",
  output: {
    filename: "./dist/client/app.js",
  },

  resolve: {
    extensions: ["", ".ts", ".tsx", ".js"],
  },

  module: {
    loaders: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
    ],
  },

  plugins: [
    new CheckerPlugin(),
    new webpack.DefinePlugin({
      "process.env": { "NODE_ENV": JSON.stringify(process.env.NODE_ENV) },
    }),
  ],
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({ 
    compress: {
      screw_ie8: true,
      warnings: false,
    },
  }));
} else {
  config.devtool = "#cheap-module-source-map";
  config.devServer = {
    contentBase: "./src/client",
    hot: true,
    inline: true,
    host: "0.0.0.0",
    port: 8080,
  };
}

module.exports = config;
