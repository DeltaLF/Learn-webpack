import prodConfig from "./webpack.prod";
const SpeedMesurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMesurePlugin();
const { merge } = require("webpack-merge");

module.exports = smp.wrap(merge(prodConfig, {}));
