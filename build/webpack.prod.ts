import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import baseConfig from "./webpack.base";
import CopyPlugin from "copy-webpack-plugin";
import path from "path";

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
  ],
});

export default prodConfig;
