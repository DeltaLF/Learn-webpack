import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import baseConfig from "./webpack.base";
import CopyPlugin from "copy-webpack-plugin";
import path from "path";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

// tree shaking css
const globAll = require("glob-all");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");

const prodConfig: Configuration = merge(baseConfig, {
  mode: "production", // prod mode: enable tree-shaking, compressing, other optimization
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"), // copy from
          to: path.resolve(__dirname, "../dist"), // copy to
          filter: (source) => !source.includes("index.html"), // ignore index.html
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css", // exatracted css
    }),
    // tree shaking css check all tsx under src and index.html under public that useing class, id tag
    // only bundle those in use
    new PurgeCSSPlugin({
      paths: globAll.sync(
        [
          `${path.join(__dirname, "../src")}/**/*`,
          path.join(__dirname, "../public/index.html"), //after index.html is added, selectors which select the tags that defined at index.html are not shaken off
        ],
        {
          nodir: true,
        }
      ),
      // use only as the entry point of purgecss-webpack-plugin
      // only: ["dist"],
      only: ["aaa"],
      // only: ["bundle", "vendor"],
      // only: ["main*", "*", "main"],
      safelist: {
        standard: [/^ant-/], // white lift tag start with ant
      },
    }),

    new CompressionPlugin({
      test: /\.(js|css)$/, // only generat compressed js,css
      filename: "[path][base].gz",
      algorithm: "gzip",
      threshold: 10240, // compress file over 10kb
      minRatio: 0.8, //
    }),
  ],
  optimization: {
    splitChunks: {
      // split code into chunks
      cacheGroups: {
        vendors: {
          // extract node_modules
          test: /node_modules/, // only match node_modules
          name: "vendors", //name the extracted file as vendors
          minChunks: 1, // extract it as long as it used once
          chunks: "initial", //not care async, only take those can be access while initialization
          minSize: 0, // extract if code size >0
          priority: 1,
        },
        commons: {
          // extract common code
          name: "commons", // name the extracted file as commons
          minChunks: 2, //extract it if it is used twice
          chunks: "initial",
          minSize: 0,
        },
      },
    },
    minimizer: [
      new CssMinimizerPlugin(), // minimize css
      new TerserPlugin({
        parallel: true, // multiple thread compressing
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"], // delete console.log
          },
        },
      }),
    ],
  },
  performance: {
    hints: false,
    maxAssetSize: 4000000,
    maxEntrypointSize: 5000000,
  },
});

export default prodConfig;
