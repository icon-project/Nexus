const { CleanWebpackPlugin: CleanPlugin } = require("clean-webpack-plugin");
const MinimizeJsonPlugin = require("json-minimizer-webpack-plugin");
const CssPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = ({ contentBase, publicDir }) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [CssPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [new CleanPlugin(), new CssPlugin()],
  optimization: {
    chunkIds: "deterministic",
    moduleIds: "deterministic",
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            ecma: 2020,
            comments: false,
          },
        },
        extractComments: false,
      }),
      new MinimizeJsonPlugin(),
    ],
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      minSize: 5120,
      maxInitialRequests: Infinity,
      cacheGroups: {
        npm: {
          test: /[\\/]node_modules[\\/]/,
          name(modules, chunk) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            // debugger;

            const packageName = modules.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace("@", "")}`;
          },
        },
        static: {
          test: /src[\\/]rjs-visitor[\\/]resource/,
          name(modules, chunk) {
            // debugger;
            const packageName = modules.context.match(
              /[\\/]resource[\\/](.*?)([\\/]|$)/
            )[1];

            return `static.${packageName.replace("@", "")}`;
          },
        },
      },
    },
  },
  devServer: {
    contentBase,
    contentBasePublicPath: `/${publicDir}`,
    // https: true,
    allowedHosts: [".herokuapp.com"],
    hot: true,
    open: true,
    clientLogLevel: "error",
    publicPath: "/",
  },
});
