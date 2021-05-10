// gzip production code
const CompressionPlugin = require("compression-webpack-plugin");
// const HtmlWebpackChangeAssetsExtensionPlugin = require("html-webpack-change-assets-extension-plugin");

module.exports = () => ({
  plugins: [
    new CompressionPlugin({
      exclude: /\.txt$/,
    }),
  ],
});
