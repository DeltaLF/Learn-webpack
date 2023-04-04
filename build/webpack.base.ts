const path = require("path");
import { Configuration, DefinePlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import * as dotenv from "dotenv";
import WebpackBar from "webpackbar";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV === "development";
const envConfig = dotenv.config({
  path: path.resolve(__dirname, "../env/.env." + process.env.BASE_ENV),
});
// __dirname: /build/
console.log("NODE_ENV", process.env.NODE_ENV);
console.log("BASE_ENV", process.env.BASE_ENV);

const tsxRegex = /.(ts|tsx)$/; // match ts, tsx
const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;
const lessRegex = /\.less$/;
const stylRegex = /\.styl$/;

/*
in dev css is embedded in style tag (for hot loading)
in build mode; css is extracted as a stand alone css file
*/
const styleLoadersArray = [
  isDev ? "style-loader" : MiniCssExtractPlugin.loader,
  {
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: "[path][name]__[local]--[hash:5]", // generated css name
      },
    },
  },
  "postcss-loader", // for css3 compatible
];

const baseConfig: Configuration = {
  entry: path.join(__dirname, "../src/index.tsx"),
  output: {
    filename: "static/js/[name].js", // every output js name
    path: path.join(__dirname, "../dist"),
    clean: true,
    publicPath: "/",
    assetModuleFilename: "images/[hash][ext][query]",
  },
  // loader
  module: {
    rules: [
      {
        test: tsxRegex, //thread-loader not support for MiniCSsExtractPlugin
        exclude: /node_modules/,
        use: ["thread-loader", "babel-loader"], // babel-loader defined in babel.config.js
      },
      {
        test: /\.json$/,
        type: "asset",
        generator: {
          filename: "static/json/[name].[hash][ext][query]",
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // font
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: "static/fonts/[hash][ext][query]",
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: "static/media/[hash][ext][query]",
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            /*
            encode data to base64 and append on html(inside main.js since it's used in React jsx)
            so no need to send http request to fetch data it's good for small resouce
            */

            maxSize: 10 * 1024, // encode to base64 if < 10kb
          },
        },
        generator: {
          filename: "static/images/[hash][ext][query]", // generated files
        },
      },
      {
        test: cssRegex, // match css
        use: styleLoadersArray, //["style-loader", "css-loader"],
      },
      {
        test: lessRegex,
        use: [
          ...styleLoadersArray,
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                importLoaders: 2,
                // modules:true
                // add the above line to not need to add module in files name
                javascriptEnabled: true, // inorder to wrtie less in js
              },
            },
          },
        ],
      },
      {
        test: sassRegex,
        use: [...styleLoadersArray, "sass-loader"],
      },
      {
        test: stylRegex,
        use: [...styleLoadersArray, "stylus-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".less", ".css"],
    alias: {
      "@": path.join(__dirname, "../src"),
    },
    modules: ["node_modules"], //path.resolve(__dirname, "../node_modules")], // access the installed modules
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
    new WebpackBar({
      color: "#85d",
      basic: false, // a simple logger
      profile: false,
    }),
  ],
  cache: {
    type: "filesystem",
    allowCollectingMemory: true,
  },
};

export default baseConfig;
