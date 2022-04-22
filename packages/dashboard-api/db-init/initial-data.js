/* eslint-disable quotes */
/* eslint-disable indent */

const env = process.env;
const initialDataQuery = [
  // -- ### Network ###
  `INSERT INTO networks (id, name, native_token, path_logo, url) VALUES ('${env.ICON_NETWORK_ID}', '${env.ICON_NAME}', '${env.ICON_NATIVE_TOKEN}', '${env.ICON_NETWORK_PATH_LOGO}', '${env.ICON_NETWORK_URL}');`,
  `INSERT INTO networks (id, name, native_token, path_logo, url) VALUES ('${env.MOONBEAM_NETWORK_ID}', '${env.MOONBEAM_NAME}', '${env.MOONBEAM_NATIVE_TOKEN}','${env.MOONBEAM_NETWORK_PATH_LOGO}', '${env.MOONBEAM_NETWORK_URL}');`,
  `INSERT INTO networks (id, name, native_token, path_logo, url) VALUES ('${env.BSC_NETWORK_ID}', '${env.BSC_NAME}', '${env.BSC_NATIVE_TOKEN}','${env.BSC_NETWORK_PATH_LOGO}', '${env.BSC_NETWORK_URL}');`,
  `INSERT INTO networks (id, name, native_token, path_logo, url) VALUES ('${env.HARMONY_NETWORK_ID}', '${env.HARMONY_NAME}', '${env.HARMONY_NATIVE_TOKEN}','${env.HARMONY_NETWORK_PATH_LOGO}', '${env.HARMONY_NETWORK_URL}');`,

  // -- ### Indexer stats ###
  `INSERT INTO indexer_stats (network_id, name) VALUES ('${env.ICON_NETWORK_ID}', '${env.ICON_NAME}');`,
  `INSERT INTO indexer_stats (network_id, name) VALUES ('${env.MOONBEAM_NETWORK_ID}', '${env.MOONBEAM_NAME}');`,
  `INSERT INTO indexer_stats (network_id, name) VALUES ('${env.HARMONY_NETWORK_ID}', '${env.HARMONY_NAME}');`,
  `INSERT INTO indexer_stats (network_id, name) VALUES ('${env.BSC_NETWORK_ID}', '${env.BSC_NAME}');`,

  // -- ### Token prices ###
  `INSERT INTO token_prices (coingecko_id, name, price, active) VALUES ('ethereum', 'ETH', 3823.55, 1);`,
  `INSERT INTO token_prices (coingecko_id, name, price, active) VALUES ('dev-protocol', 'DEV', 0.01, 1);`,
  `INSERT INTO token_prices (coingecko_id, name, price, active) VALUES ('icon', 'ICX', 2.09, 1);`,
  `INSERT INTO token_prices (coingecko_id, name, price, active) VALUES ('binancecoin', 'BNB', 493.95, 1);`,
];

module.exports = {
  initialDataQuery
};
