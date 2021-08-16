INSERT INTO public.relay_candidates(
	id, rank, name, bonded_icx, server_status, total_transferred_tx, total_failed_tx,
	total_active, registered_time, created_time)
	VALUES ('2c37741ffa', 1, 'Relay 1', 1000, 1, 100, 0, 1, (NOW() - interval '2 hour'), NOW());

INSERT INTO public.relay_candidates(
	id, rank, name, bonded_icx, server_status, total_transferred_tx, total_failed_tx,
	total_active, registered_time, created_time)
	VALUES ('2c37741ffb', 2, 'Relay 2', 2000, 2, 1000, 10, 2, (NOW() - interval '1 hour'), NOW());

INSERT INTO public.relay_candidates(
	id, rank, name, bonded_icx, server_status, total_transferred_tx, total_failed_tx,
	total_active, registered_time, created_time)
	VALUES ('2c37741ffc', 3, 'Relay 3', 10450, 3, 101230, 210, 3, NOW(), NOW());

INSERT INTO public.relay_candidates(
	id, rank, name, bonded_icx, server_status, total_transferred_tx, total_failed_tx,
	total_active, registered_time, created_time)
	VALUES ('2c37741ffd', 4, 'Relay 4', 1010, 4, 1234, 567, 4, NOW(), NOW());

INSERT INTO public.relay_candidates(
	id, rank, name, bonded_icx, server_status, total_transferred_tx, total_failed_tx,
	total_active, registered_time, created_time)
	VALUES ('2c37741ffe', 5, 'Relay 5', 1010, 5, 1234, 567, 5, NOW(), NOW());

INSERT INTO public.relay_rewards (created_time, id, relay_id, reward_value, updated_time) VALUES ('2021-07-13 15:16:36', '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000', '2c37741ffa', 100, '2021-07-13 15:16:36');
INSERT INTO public.relay_rewards (created_time, id, relay_id, reward_value, updated_time) VALUES ('2021-07-13 15:16:36', '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc001', '2c37741ffb', 200, '2021-07-13 15:16:36');
INSERT INTO public.relay_rewards (created_time, id, relay_id, reward_value, updated_time) VALUES ('2021-07-13 15:16:36', '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc002', '2c37741ffc', 300, '2021-07-13 15:16:36');
INSERT INTO public.relay_rewards (created_time, id, relay_id, reward_value, updated_time) VALUES ('2021-07-13 15:16:36', '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc003', '2c37741ffd', 400, '2021-07-13 15:16:36');
INSERT INTO public.relay_rewards (created_time, id, relay_id, reward_value, updated_time) VALUES ('2021-07-13 15:16:36', '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc004', '2c37741ffa', 500, '2021-07-13 15:16:36');

-- Issue #226

INSERT INTO public.token_prices(cmc_id, name, price, active, created_time, updated_time)
VALUES (1, 'BTC', 1, 1, NOW(), NOW());

INSERT INTO public.token_prices(cmc_id, name, price, active, created_time, updated_time)
VALUES (1027, 'ETH', 1, 1, NOW(), NOW());

INSERT INTO public.token_prices(cmc_id, name, price, active, created_time, updated_time)
VALUES (52, 'DEV', 1, 1, NOW(), NOW());

INSERT INTO public.token_prices(cmc_id, name, price, active, created_time, updated_time)
VALUES (0, 'NONE', 1, 1, NOW(), NOW());

INSERT INTO public.token_prices(cmc_id, name, price, active, created_time, updated_time)
VALUES (2099, 'ICX', 1, 1, NOW(), NOW());
