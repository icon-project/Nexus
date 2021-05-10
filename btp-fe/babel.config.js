module.exports = (api) => {
  const development = api.env() == "development";

  api.cache.using(() => process.env.NODE_ENV != "production");

  const plugins = [
    "@babel/plugin-proposal-class-properties",
    "@emotion",
    development && "react-refresh/babel",
  ].filter(Boolean);

  return {
    plugins,
    presets: [
      "@babel/preset-env",
      [
        "@babel/preset-react",
        { runtime: "automatic", importSource: "@emotion/react", development },
      ],
    ],
  };
};
