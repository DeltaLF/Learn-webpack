import prodConfig from "./webpack.prod";
const SpeedMesurePlugin = require("speed-measure-webpack-plugin");
const { merge } = require("webpack-merge");
import { Configuration } from "webpack";
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const smp = new SpeedMesurePlugin();

const analyConfig: Configuration = smp.wrap(
  merge(prodConfig, {
    plugins: [new BundleAnalyzerPlugin()], // analyze bundle result
  })
);

export default analyConfig;
