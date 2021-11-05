-- Initial data for public.networks (Issue #33).
-- Note: run script in migration.sql to update table networks before run scrips bellow

-- ### Supported networks ###

INSERT INTO networks (id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at)
  VALUES ('0x58eb1c', 'ICON', 'ICX', './image/logo/icon-icx-logo.png', 'https://icon.foundation', 0, 0, NOW(), NOW());

INSERT INTO networks (id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at)
  VALUES ('0x501', 'Moonbeam', 'DEV','./image/logo/moonbeam-glmr-logo.png', 'https://moonbeam.network/', 0, 0, NOW(), NOW());

--INSERT INTO networks(id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at)
--  VALUES('0x1', 'NEARProtocol', 'NEAR','./image/logo/near-protocol-near-logo.png', 'https://near.org/', 0, 0, NOW(), NOW());

INSERT INTO networks (id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at)
  VALUES ('0x97', 'BSC', 'BNB','./image/logo/binance-bnb-logo.png', 'https://www.binance.com/', 0, 0, NOW(), NOW());

INSERT INTO indexer_stats (network_id, name, block_height, updated_time) VALUES ('0x58eb1c', 'ICON', 0, NOW());
INSERT INTO indexer_stats (network_id, name, block_height, updated_time) VALUES ('0x501', 'Moonbeam', 0, NOW());
INSERT INTO indexer_stats (network_id, name, block_height, updated_time) VALUES ('0x97', 'BSC', 0, NOW());

-- ### Token prices ###

INSERT INTO public.token_prices (cmc_id, name, price, active, created_time, updated_time)
  VALUES (1027, 'ETH', 3823.55, 1, NOW(), NOW());

INSERT INTO public.token_prices (cmc_id, name, price, active, created_time, updated_time)
  VALUES (52, 'DEV', 0.01, 1, NOW(), NOW());

INSERT INTO public.token_prices (cmc_id, name, price, active, created_time, updated_time)
  VALUES (2099, 'ICX', 2.09, 1, NOW(), NOW());

INSERT INTO public.token_prices (cmc_id, name, price, active, created_time, updated_time)
  VALUES (1839, 'BNB', 493.95, 1, NOW(), NOW());

-- ### Registered tokens ###

-- ICON

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address)
	VALUES ('0726c26f-4664-4e78-a8ea-ea3082e18dec', '0x58eb1c', 'ICX', '0', '', NOW(), 'cxc53d35b4cd28150ee1bd9a36a6d882a5af37b7fd', 'cxc53d35b4cd28150ee1bd9a36a6d882a5af37b7fd');

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address)
  VALUES ('76d2e6d8-c3f6-4d44-b87f-67505025155e', '0x58eb1c', 'DEV', '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963', '0x8fabd9ad200497d59f0e2528772d2df8e98093ca3645b821d78286056e9a7c9e', NOW(), '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963', '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963');

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address)
	VALUES ('2c645591-26ef-4652-a4eb-2475d1043261', '0x58eb1c', 'ETH', '0x8f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd', '0x8fabd9ad200497d59f0e2528772d2df8e98093ca3645b821d78286056e9a7c9e', NOW(), 'cx77622c6d0bcd80048eb159aa99fd30df2f38c97f', 'cxe32aa9a25c3a934134db8dd6749832fee8b45834');

-- Moonbeam

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address)
  VALUES ('2a8659bf-4993-42e8-bb17-43933e5f219f', '0x501', 'DEV', '0', '', NOW(), '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963', '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963');

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address)
VALUES ('abf2986a-7f88-4dc6-8c11-8f38976fe07f', '0x501', 'ICX', '0x74645123150620096120801602238006067452189572593452417212166420008730219938226', '0xb5b49cd71c1d403db3cb0e7a0a8eeddf8fba93eb15930709ca5583912fc64d6c', NOW(), '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963', '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963');

-- BSC

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address)
	VALUES ('c610d092-69d7-4b99-860f-e5553db9c1b4', '0x97', 'BNB', '0', '', NOW(), 'cxc53d35b4cd28150ee1bd9a36a6d882a5af37b7fd', 'cxc53d35b4cd28150ee1bd9a36a6d882a5af37b7fd');

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address)
	VALUES ('4f144a90-8eb8-49c4-bfb7-6e5976ebe85b', '0x97', 'ICX', '0x74645123150620096120801602238006067452189572593452417212166420008730219938226', '0x8fabd9ad200497d59f0e2528772d2df8e98093ca3645b821d78286056e9a7c9e', NOW(), 'cxc53d35b4cd28150ee1bd9a36a6d882a5af37b7fd', 'cxc53d35b4cd28150ee1bd9a36a6d882a5af37b7fd');

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address)
	VALUES ('9af58527-979b-43a1-8d39-7fdf9fb4129b', '0x97', 'ETH', '0x74645123150620096120801602238006067452189572593452417212166420008730219938226', '0x8fabd9ad200497d59f0e2528772d2df8e98093ca3645b821d78286056e9a7c9e', NOW(), 'cxc53d35b4cd28150ee1bd9a36a6d882a5af37b7fd', 'cxc53d35b4cd28150ee1bd9a36a6d882a5af37b7fd');
