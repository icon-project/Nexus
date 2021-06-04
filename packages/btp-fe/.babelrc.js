// const config = require('./src/config');
const plugins = [
  // [
  //   'i18next-extract',
  //   {
  //     outputPath: 'public/locales/{{locale}}/{{ns}}.json',
  //     locales: config.supportedLngs,
  //     discardOldKeys: true,
  //   },
  // ],
];

const presets = [
  [
    'react-app',
    {
      runtime: 'automatic',
    },
  ],
];

module.exports = { plugins, presets };
