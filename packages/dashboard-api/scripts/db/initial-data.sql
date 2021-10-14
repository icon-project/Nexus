-- Initial data for public.networks (Issue #33).
-- Note: run script in migration.sql to update table networks before run scrips bellow

INSERT INTO networks(id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at)
  VALUES('0x58eb1c', 'ICON', 'ICX', './image/logo/icon-icx-logo.png', 'https://iconrepublic.org/', 0, 0, NOW(), NOW());

INSERT INTO networks(id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at)
  VALUES('0x501', 'Moonbeam', 'GLMR','./image/logo/moonbeam-glmr-logo.png', 'https://moonbeam.network/', 0, 0, NOW(), NOW());

INSERT INTO networks(id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at)
  VALUES('0x1', 'NEARProtocol', 'NEAR','./image/logo/near-protocol-near-logo.png', 'https://near.org/', 0.02, 0.02, NOW(), NOW());

INSERT INTO networks(id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at)
  VALUES('0x61', 'BSC', 'BNB','./image/logo/binance-bnb-logo.png', 'https://www.binance.com/', 0.01, 0.02, NOW(), NOW());

-- Issue #280

INSERT INTO indexer_stats (network_id, name, block_height, updated_time) VALUES ('0x61', 'BSC', 0, NOW());

-- Issue #315

INSERT INTO indexer_stats (network_id, name, block_height, updated_time) VALUES ('0x58eb1c', 'ICON', 0, NOW());
INSERT INTO indexer_stats (network_id, name, block_height, updated_time) VALUES ('0x501', 'Moonbeam', 0, NOW());

-- Issue #371

INSERT INTO public.token_prices(cmc_id, name, price, active, created_time, updated_time)
VALUES (1, 'BTC', 1, 1, NOW(), NOW());

INSERT INTO public.token_prices(cmc_id, name, price, active, created_time, updated_time)
VALUES (1027, 'ETH', 1, 1, NOW(), NOW());

INSERT INTO public.token_prices(cmc_id, name, price, active, created_time, updated_time)
VALUES (52, 'DEV', 1, 1, NOW(), NOW());

INSERT INTO public.token_prices(cmc_id, name, price, active, created_time, updated_time)
VALUES (2099, 'ICX', 1, 1, NOW(), NOW());

-- Issue #395

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address)
	VALUES ('0726c26f-4664-4e78-a8ea-ea3082e18dec', '0x58eb1c', 'ICX', '0', '', NOW(), 'cxc53d35b4cd28150ee1bd9a36a6d882a5af37b7fd', 'cxc53d35b4cd28150ee1bd9a36a6d882a5af37b7fd');

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address)
  VALUES ('76d2e6d8-c3f6-4d44-b87f-67505025155e', '0x501', 'DEV', '0', '', NOW(), '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963', '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963');
