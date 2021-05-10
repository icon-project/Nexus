const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ProgressPlugin, DefinePlugin } = require("webpack");
const { merge } = require("webpack-merge");
const path = (uri) => require("path").resolve(__dirname, uri);
const presetConfig = require("./build-utils/loadPresets");
const dev = process.env.NODE_ENV === "development";
// const { build } = require("./src/rjs-visitor/utils/build.json");

const modeConfig = (options) =>
  require(`./build-utils/webpack.${options.mode}`)(options);

const scripts = (() => {
  const baseCdns = [];
  const cdns = [];
  // ? []
  // : [
  //     "https://unpkg.com/react@17/umd/react.production.min.js",
  //     "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
  //     "https://unpkg.com/@emotion/react@11/dist/emotion-react.umd.min.js",
  //     "https://unpkg.com/xstate@4/dist/xstate.js",
  //   ];

  return cdns
    .concat(baseCdns)
    .map((e) =>
      e.startsWith("https://") || e.startsWith("assets/")
        ? `<script crossorigin type="text/javascript" src="${e}"></script>`
        : `<script>${e}</script>`
    )
    .join("");
})();

const target = dev ? "web" : "browserslist";
const distPath = path("dist");
const srcDir = path("src");
const contentBase = `${srcDir}/resources`;
const publicDir = "assets";
const htmlTemplate = `${srcDir}/template.html`;
const favicon = `${contentBase}/imgs/favicon.svg`;

const entry = {
  main: `${srcDir}/index.js`,
};

const output = {
  path: distPath,
  // chunkFilename: `${publicDir}/js/[name].[contenthash:8].lazy-chunk.js`,
  chunkFilename: (pathData) => {
    // dev && console.log("async", pathData);
    // debugger;

    return `${publicDir}/js/${dev ? "[name]." : ""}[contenthash:8].dynamic.js`;
  },
  filename: (pathData) => {
    // dev && console.log("sync", pathData);

    return `${publicDir}/js/${dev ? "[name]." : ""}[contenthash:8].async.js`;
  },
};

const BabelLoader = {
  test: /\.jsx?$/i,
  use: {
    loader: "babel-loader",
    options: { cacheDirectory: true },
  },
  exclude: /node_modules/,
};

const UrlLoader = {
  test: /\.(bmp|gif|jpe?g|svg|png)$/i,
  loader: "url-loader",
  options: {
    limit: 5120,
    name: "[name].[contenthash:8].[ext]",
    outputPath: `${publicDir}/imgs`,
  },
};

const FileLoader = [
  {
    test: /lotties\/.*\.json$/i,
    loader: "file-loader",
    type: "javascript/auto",
    options: {
      name: "[name].[ext]",
      outputPath: "assets/animation",
    },
  },
];

const plugins = [
  new DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  }),
  new HtmlWebpackPlugin({
    template: htmlTemplate,
    title: dev && " dev",
    scripts: scripts,
    filename: "index.html",
    // favicon,
  }),
  new ProgressPlugin(),
  !dev &&
    new CopyPlugin({
      patterns: [],
    }),
].filter(Boolean);

module.exports = ({ mode, presets = [] }) => {
  if (process.env.NODE_ENV) {
    mode = process.env.NODE_ENV;
  }

  return merge(
    {
      mode,
      entry,
      output,
      target,
      plugins,
      stats: {
        preset: "errors-only",
        moduleTrace: true,
        errorDetails: true,
        assets: true,
        assetsSort: "id",
        colors: true,
      },
      module: {
        rules: [BabelLoader, UrlLoader, ...FileLoader],
      },

      // externals: dev
      //   ? {}
      //   : {
      //       "@emotion/react": "emotionReact",
      //       xstate: "XState",
      //       react: "React",
      //       "react-dom": "ReactDOM",
      //     },
    },
    modeConfig({ mode, contentBase, publicDir }),
    presetConfig({ mode, presets })
  );
};
