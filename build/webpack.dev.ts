import path from "path";
import { merge } from "webpack-merge";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackServerConfiguration } from "webpack-dev-server";
import WebpackDevServer from "webpack-dev-server";
import baseConfig from "./webpack.base";
import { webpack } from "webpack";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackServerConfiguration;
}

const host = "127.0.0.1";
const port = "8082";

// merge base config and add dev setup
const devConfig: Configuration = merge(baseConfig, {
  mode: "development", // skip optimization and faster in bundling
  devtool: "eval-cheap-module-source-map",
});

const devServer = new WebpackDevServer(
  {
    host,
    port,
    open: true,
    compress: false, // gzip compress (not ncessary in dev mode)
    hot: true, // hot reload
    historyApiFallback: true, //hitstory route 404
    setupExitSignals: true, // allow to leave server and close process while SIGINT and SIGTERM
    static: {
      directory: path.join(__dirname, "../public"),
    },
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  webpack(devConfig)
);

devServer.start();

export default devConfig;
