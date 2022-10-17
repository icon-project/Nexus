/* eslint-disable quotes */
/* eslint-disable indent */

const env = process.env;
const initialDataQuery = [
  // -- ### Network ###
  `INSERT INTO networks (id, name, native_token, path_logo, url) VALUES ('${env.ICON_NETWORK_ID}', '${env.ICON_NAME}', '${env.ICON_NATIVE_TOKEN}', '${env.ICON_NETWORK_PATH_LOGO}', '${env.ICON_NETWORK_URL}');`,
  `INSERT INTO networks (id, name, native_token, path_logo, url) VALUES ('${env.MOONBEAM_NETWORK_ID}', '${env.MOONBEAM_NAME}', '${env.MOONBEAM_NATIVE_TOKEN}','${env.MOONBEAM_NETWORK_PATH_LOGO}', '${env.MOONBEAM_NETWORK_URL}');`,
  `INSERT INTO networks (id, name, native_token, path_logo, url) VALUES ('${env.BSC_NETWORK_ID}', '${env.BSC_NAME}', '${env.BSC_NATIVE_TOKEN}','${env.BSC_NETWORK_PATH_LOGO}', '${env.BSC_NETWORK_URL}');`,
  `INSERT INTO networks (id, name, native_token, path_logo, url) VALUES ('${env.HARMONY_NETWORK_ID}', '${env.HARMONY_NAME}', '${env.HARMONY_NATIVE_TOKEN}','${env.HARMONY_NETWORK_PATH_LOGO}', '${env.HARMONY_NETWORK_URL}');`,
  `INSERT INTO networks (id, name, native_token, path_logo, url) VALUES ('${env.NEAR_NETWORK_ID}', '${env.NEAR_NAME}', '${env.NEAR_NATIVE_TOKEN}','${env.NEAR_NETWORK_PATH_LOGO}', '${env.NEAR_NETWORK_URL}');`,

  // -- ### Indexer stats ###
  `INSERT INTO indexer_stats (network_id, name) VALUES ('${env.ICON_NETWORK_ID}', '${env.ICON_NAME}');`,
  `INSERT INTO indexer_stats (network_id, name) VALUES ('${env.MOONBEAM_NETWORK_ID}', '${env.MOONBEAM_NAME}');`,
  `INSERT INTO indexer_stats (network_id, name) VALUES ('${env.HARMONY_NETWORK_ID}', '${env.HARMONY_NAME}');`,
  `INSERT INTO indexer_stats (network_id, name) VALUES ('${env.BSC_NETWORK_ID}', '${env.BSC_NAME}');`,
  `INSERT INTO indexer_stats (network_id, name) VALUES ('${env.NEAR_NETWORK_ID}', '${env.NEAR_NAME}');`,

  // -- ### Token prices ###
  `INSERT INTO public.token_prices (coingecko_id, name, price, active) VALUES ('staked-icx', 'sICX', 0, 1);`,
  `INSERT INTO public.token_prices (coingecko_id, name, price, active) VALUES ('balanced-dollars', 'bnUSD', 0, 1);`,
  `INSERT INTO public.token_prices (coingecko_id, name, price, active) VALUES ('binance-usd', 'BUSD', 0, 1);`,
  `INSERT INTO public.token_prices (coingecko_id, name, price, active) VALUES ('usd-coin', 'USDC', 0, 1);`,
  `INSERT INTO public.token_prices (coingecko_id, name, price, active) VALUES ('binancecoin', 'BNB', 0, 1);`,
  `INSERT INTO public.token_prices (coingecko_id, name, price, active) VALUES ('tether', 'USDT', 0, 1);`,
  `INSERT INTO public.token_prices (coingecko_id, name, price, active) VALUES ('binance-bitcoin', 'BTCB', 0, 1);`,
  `INSERT INTO public.token_prices (coingecko_id, name, price, active) VALUES ('ethereum', 'ETH', 0, 1);`,
  `INSERT INTO public.token_prices (coingecko_id, name, price, active) VALUES ('near', 'NEAR', 0, 1);`,

];

module.exports = {
  initialDataQuery
};
