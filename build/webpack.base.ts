const path = require("path");
import { Configuration, DefinePlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import * as dotenv from "dotenv";

const envConfig = dotenv.config({
  path: path.resolve(__dirname, "../env/.env." + process.env.BASE_ENV),
});

console.log("NODE_ENV", process.env.NODE_ENV);
console.log("BASE_ENV", process.env.BASE_ENV);

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
      title: "webpack5-react-ts",
      filename: "index.html",
      // duplicate index.html and bundle all the resources (js, css)
      template: path.join(__dirname, "../public/index.html"),
      inject: true, // auto inject static resouce
      hash: true,
      cache: false,
      // compress html
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
      },
      nodeModules: path.resolve(__dirname, "../node_modules"),
    }),
    new DefinePlugin({
      "process.env": JSON.stringify(envConfig.parsed), //envConfig.parsed),
      "process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};

export default baseConfig;
