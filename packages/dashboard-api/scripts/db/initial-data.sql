-- Initial data for public.networks (Issue #33).
-- Note: run script in migration.sql to update table networks before run scrips bellow

-- ### Supported networks ###

INSERT INTO networks (id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at) VALUES ('0x42', 'ICON', 'ICX', './image/logo/icon-icx-logo.png', 'https://icon.foundation', 0, 0, NOW(), NOW());
INSERT INTO networks (id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at) VALUES ('0x507', 'Moonbeam', 'DEV','./image/logo/moonbeam-glmr-logo.png', 'https://moonbeam.network', 0, 0, NOW(), NOW());
INSERT INTO networks (id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at) VALUES('testnet', 'NEAR Protocol', 'NEAR','./image/logo/near-protocol-near-logo.png', 'https://near.org', 0, 0, NOW(), NOW());
--INSERT INTO networks (id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at) VALUES ('0x97', 'BSC', 'BNB','./image/logo/binance-bnb-logo.png', 'https://www.binance.com', 0, 0, NOW(), NOW());

INSERT INTO indexer_stats (network_id, name, block_height, updated_time) VALUES ('0x42', 'ICON', 0, NOW());
INSERT INTO indexer_stats (network_id, name, block_height, updated_time) VALUES ('0x507', 'Moonbeam', 0, NOW());
--INSERT INTO indexer_stats (network_id, name, block_height, updated_time) VALUES ('0x97', 'BSC', 0, NOW());
INSERT INTO indexer_stats (network_id, name, block_height, updated_time) VALUES ('testnet', 'NEAR Protocol', 0, NOW());

-- ### Token prices ###

--INSERT INTO public.token_prices (cmc_id, name, price, active, created_time, updated_time) VALUES (1027, 'ETH', 3823.55, 1, NOW(), NOW());
INSERT INTO public.token_prices (cmc_id, name, price, active, created_time, updated_time) VALUES (52, 'DEV', 0.01, 1, NOW(), NOW());
INSERT INTO public.token_prices (cmc_id, name, price, active, created_time, updated_time) VALUES (2099, 'ICX', 2.09, 1, NOW(), NOW());
--INSERT INTO public.token_prices (cmc_id, name, price, active, created_time, updated_time) VALUES (1839, 'BNB', 493.95, 1, NOW(), NOW());

-- ### Registered tokens ###

-- ICON

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address) VALUES ('0726c26f-4664-4e78-a8ea-ea3082e18dec', '0x42', 'ICX', '0', '', NOW(), 'ICON_NATIVE_COIN_BSH_ADDRESS', '');

--INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address) VALUES ('c840b447-23aa-4ab9-82cf-f797428a3525', '0xd35bbb', 'BNB', 'coinId', '', NOW(), 'ICON_NATIVE_COIN_BSH_ADDRESS', '');

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address) VALUES ('76d2e6d8-c3f6-4d44-b87f-67505025155e', '0x42', 'DEV', 'coinId', '', NOW(), 'ICON_NATIVE_COIN_BSH_ADDRESS', '');

--INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address) VALUES ('2c645591-26ef-4652-a4eb-2475d1043261', '0x58eb1c', 'ETH', 'ETH', '', NOW(), 'token_bsh.icon', '');

-- Moonbeam

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address) VALUES ('2a8659bf-4993-42e8-bb17-43933e5f219f', '0x507', 'DEV', '0', '', NOW(), 'MOONBEAM_BSH_CORE_ADDRESS', '');

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address) VALUES ('abf2986a-7f88-4dc6-8c11-8f38976fe07f', '0x507', 'ICX', 'coinId', '', NOW(), 'MOONBEAM_BSH_CORE_ADDRESS', '');

-- BSC

--INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address) VALUES ('c610d092-69d7-4b99-860f-e5553db9c1b4', '0x97', 'BNB', '0', '', NOW(), 'BSC_BSH_CORE_ADDRESS', '');

--INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address) VALUES ('4f144a90-8eb8-49c4-bfb7-6e5976ebe85b', '0x97', 'ICX', 'coinId', '', NOW(), 'BSC_BSH_CORE_ADDRESS', '');

--INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address) VALUES ('9af58527-979b-43a1-8d39-7fdf9fb4129b', '0x97', 'ETH', 'ETH', '', NOW(), 'token_bsh.proxy.bsc', '');
