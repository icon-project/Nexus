-- Initial data for public.networks (Issue #33).
-- Note: run script in migration.sql to update table networks before run scrips bellow

INSERT INTO networks(id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at)
values('0x3', 'Icon', 'ICX', './image/logo/icon-icx-logo.png', 'https://iconrepublic.org/', 0.01, 0.01, NOW(), NOW());

INSERT INTO networks(id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at)
values('0x501', 'Moonbeam', 'GLMR','./image/logo/moonbeam-glmr-logo.png', 'https://moonbeam.network/', 0.02, 0.01, NOW(), NOW());

INSERT INTO networks(id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at)
values('0x1', 'NEARProtocol', 'NEAR','./image/logo/near-protocol-near-logo.png', 'https://near.org/', 0.02, 0.02, NOW(), NOW());

INSERT INTO networks(id, name, native_token, path_logo, url, mint_fee, burn_fee, create_at, update_at)
values('0x4', 'Binance', 'BNB','./image/logo/binance-bnb-logo.png', 'https://www.binance.com/', 0.01, 0.02, NOW(), NOW());

-- Issue #280

INSERT INTO indexer_stats (network_id, name, block_height, updated_time) VALUES ('0x61', 'BSC', 0, NOW());
