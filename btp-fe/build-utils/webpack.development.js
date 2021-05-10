const RR = require("@pmmmwh/react-refresh-webpack-plugin");
const { HotModuleReplacementPlugin: HMR } = require("webpack");

module.exports = ({ contentBase, publicDir }) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devtool: "source-map",
  plugins: [new HMR(), new RR()],
  devServer: {
    contentBase,
    contentBasePublicPath: `/${publicDir}`,
    // https: true,
    allowedHosts: [".herokuapp.com", "localhost"],
    // disableHostCheck: true,
    // public: "ssh-lv.herokuapp.com",
    open: true,
    quiet: true,
    noInfo: true,
    hot: true,
    hotOnly: true,
    inline: true,
    overlay: true,
    clientLogLevel: "error",
    publicPath: "/",
  },
});
