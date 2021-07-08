-- Test data for public.networks

INSERT INTO networks(id, name, path_logo, url, mint_fee, burn_fee)
values('0x1', 'Icon', './image/logo/icon-icx-logo.png', 'https://iconrepublic.org/', 0.01, 0.01);

INSERT INTO networks(id, name, path_logo, url, mint_fee, burn_fee)
values('0x2', 'Edgeware', './image/logo/edgeware-edg-logo.png', 'https://edgewa.re/', 0.02, 0.01);

INSERT INTO networks(id, name, path_logo, url, mint_fee, burn_fee)
values('0x3', 'NEAR', './image/logo/near-protocol-near-logo.png', 'https://near.org/', 0.02, 0.02);

INSERT INTO networks(id, name, path_logo, url, mint_fee, burn_fee)
values('0x4', 'Binance', './image/logo/binance-bnb-logo.png', 'https://www.binance.com/', 0.01, 0.02);

-- Test data for public.relays

INSERT INTO public.relays(
	id, rank, name, bonded_icx, server_status, total_transferred_tx, total_failed_tx, created_time, updated_time)
	VALUES ('2c37741ffa', 1, 'Relay 1', 1000, 1, 100, 0, NOW(), NOW());

INSERT INTO public.relays(
	id, rank, name, bonded_icx, server_status, total_transferred_tx, total_failed_tx, created_time, updated_time)
	VALUES ('2c37741ffb', 2, 'Relay 2', 2000, 2, 1000, 10, NOW(), NOW());

INSERT INTO public.relays(
	id, rank, name, bonded_icx, server_status, total_transferred_tx, total_failed_tx, created_time, updated_time)
	VALUES ('2c37741ffc', 3, 'Relay 3', 10450, 3, 101230, 210, NOW(), NOW());
