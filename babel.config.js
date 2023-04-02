const isDev = process.env.NODE_ENV === "development";

module.exports = {
  // from right to left  jsx <- ts
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: 35,
          ie: 9,
        },
        // set compatible browser version
        targets: {
          browsers: ["> 1%", "last 2 versions", "not ie <=8"],
        },
        useBuiltIns: "usage", // polyfill will adjust code version according to browser version
        corejs: 3,
        loose: true,
      },
    ],
    // rutime:automatic for React 17
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    isDev && require.resolve("react-refresh/babel"),
  ].filter(Boolean),
};
