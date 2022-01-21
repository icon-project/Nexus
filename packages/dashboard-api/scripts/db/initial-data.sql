-- Initial data for public.networks (Issue #33).
-- Note: run script in migration.sql to update table networks before run scrips bellow

-- ### Clean up ###

DELETE FROM registered_tokens;
DELETE FROM relay_candidate_rewards;
DELETE FROM relay_candidates;
DELETE FROM relays;
DELETE FROM transactions;
-- UPDATE transactions SET serial_number = '0' || serial_number;

-- ### Supported networks ###

INSERT INTO networks (id, name, native_token, path_logo, url) VALUES ('0x42', 'ICON', 'ICX', './image/logo/icon-icx-logo.png', 'https://icon.foundation');
INSERT INTO networks (id, name, native_token, path_logo, url) VALUES ('0x507', 'Moonbeam', 'DEV','./image/logo/moonbeam-glmr-logo.png', 'https://moonbeam.network');
INSERT INTO networks (id, name, native_token, path_logo, url) VALUES('testnet', 'NEAR Protocol', 'NEAR','./image/logo/near-protocol-near-logo.png', 'https://near.org');
INSERT INTO networks (id, name, native_token, path_logo, url) VALUES ('0x97', 'BSC', 'BNB','./image/logo/binance-bnb-logo.png', 'https://www.binance.com');

INSERT INTO indexer_stats (network_id, name) VALUES ('0x42', 'ICON');
INSERT INTO indexer_stats (network_id, name) VALUES ('0x507', 'Moonbeam');
INSERT INTO indexer_stats (network_id, name) VALUES ('testnet', 'NEAR Protocol');
INSERT INTO indexer_stats (network_id, name) VALUES ('0x97', 'BSC');

-- ### Token prices ###

INSERT INTO token_prices (cmc_id, name, price, active) VALUES (1027, 'ETH', 3823.55, 1);
INSERT INTO token_prices (cmc_id, name, price, active) VALUES (52, 'DEV', 0.01, 1);
INSERT INTO token_prices (cmc_id, name, price, active) VALUES (2099, 'ICX', 2.09, 1);
INSERT INTO token_prices (cmc_id, name, price, active) VALUES (1839, 'BNB', 493.95, 1);

-- ### Registered tokens ###

-- ICON

-- md5(random()::text || clock_timestamp()::text)::uuid
INSERT INTO registered_tokens (network_id, token_name, contract_address, tx_hash) VALUES ('0x42', 'ICX', 'ICON_NATIVE_COIN_BSH_ADDRESS', '0x294c1e27198ae3b159f93eedd6a478966d725c4d12dd69915992afc50cb10f24');
INSERT INTO registered_tokens (network_id, token_name, contract_address, tx_hash) VALUES ('0xd35bbb', 'BNB', 'IRC2_CONTRACT_ADDRESS', '0xe839292c8f8e0bbbb33b34df27702cc72fabbd8602f23d656f7512990f5ae0c1');
INSERT INTO registered_tokens (network_id, token_name, contract_address, tx_hash) VALUES ('0x42', 'DEV', 'IRC2_CONTRACT_ADDRESS', '0xd27a921020404b62e60160634b624e372329461cc44995f40ecd30cafa0e176d');
INSERT INTO registered_tokens (network_id, token_name, contract_address, tx_hash) VALUES ('0x58eb1c', 'ETH', 'token_bsh.icon', '0x9dec32260be74cdfed593fef1ddcdfd86523050c27d8f57332c74f93811364f2');

-- Moonbeam

INSERT INTO registered_tokens (network_id, token_name, contract_address, tx_hash) VALUES ('0x507', 'DEV', 'MOONBEAM_BSH_CORE_ADDRESS', '0x5c8b55af397256d06e2be6acdefb350f92ff4363745001ce8cd367c74b10d7f3');
INSERT INTO registered_tokens (network_id, token_name, contract_address, tx_hash) VALUES ('0x507', 'ICX', 'MOONBEAM_BSH_CORE_ADDRESS', '0xb5b49cd71c1d403db3cb0e7a0a8eeddf8fba93eb15930709ca5583912fc64d6c');

-- BSC

INSERT INTO registered_tokens (network_id, token_name, contract_address, tx_hash) VALUES ('0x97', 'BNB', 'BSC_BSH_CORE_ADDRESS', '0x5673ec01d33dbbfaf1f8c621aeca47229e1dca0662e23a22bc174964525249e3');
INSERT INTO registered_tokens (network_id, token_name, contract_address, tx_hash) VALUES ('0x97', 'ICX', 'BSC_BSH_CORE_ADDRESS', '0x32dd79a4335317da1d55ffb2f4a189668dc821850277923ed442ce723bbab9a2');
INSERT INTO registered_tokens (network_id, token_name, contract_address, tx_hash) VALUES ('0x97', 'ETH', 'token_bsh.proxy.bsc', '0x3d52997b75f5f45ed5fb6b66426c2c7b0d71e53cebcb11f6e6c18712da2a047b');
