import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

const path = require("path");

const baseConfig: Configuration = {
  entry: path.join(__dirname, "../src/index.tsx"),
  output: {
    filename: "static/js/[name].js", // every output js name
    path: path.join(__dirname, "../dist"),
    clean: true,
    publicPath: "/",
  },
  // loader
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // match ts, tsx
        use: "babel-loader", // defined in babel.config.js
      },
      {
        test: /.css$/, // match css
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  // plugins
  plugins: [
    new HtmlWebpackPlugin({
      // duplicate index.html and bundle all the resources (js, css)
      template: path.join(__dirname, "../public/index.html"),
      // compress html
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],
};

export default baseConfig;
