/* eslint-disable quotes */
const dropTableQuery = [
  // Drop tables
  `DROP TABLE IF EXISTS public.burned_tokens;`,
  `DROP TABLE IF EXISTS public.indexer_stats;`,
  `DROP TABLE IF EXISTS public.minted_tokens;`,
  `DROP TABLE IF EXISTS public.networks;`,
  `DROP TABLE IF EXISTS public.registered_tokens;`,
  `DROP TABLE IF EXISTS public.relay_candidate_rewards;`,
  `DROP TABLE IF EXISTS public.relay_candidates;`,
  `DROP TABLE IF EXISTS public.relays;`,
  `DROP TABLE IF EXISTS public.token_prices;`,
  `DROP TABLE IF EXISTS public.transactions;`,
  `DROP TABLE IF EXISTS public.transfer_fees;`,
  `DROP TABLE IF EXISTS public.relay_rewards`,
  `DROP TABLE IF EXISTS public.bids`,
  `DROP TABLE IF EXISTS public.auctions`
];
module.exports = {
  dropTableQuery
};
