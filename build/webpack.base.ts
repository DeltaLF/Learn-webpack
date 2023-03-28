const path = require("path");
import { Configuration, DefinePlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import * as dotenv from "dotenv";

const envConfig = dotenv.config({
  path: path.resolve(__dirname, "../env/.env." + process.env.BASE_ENV),
});
// __dirname: /build/
console.log("NODE_ENV", process.env.NODE_ENV);
console.log("BASE_ENV", process.env.BASE_ENV);

const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;
const lessRegex = /\.less$/;
const stylRegex = /\.styl$/;

const styleLoadersArray = [
  "style-loader",
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
  },
  // loader
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // match ts, tsx
        use: "babel-loader", // defined in babel.config.js
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
  ],
};

export default baseConfig;
