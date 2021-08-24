INSERT INTO public.relay_candidates(
	id, rank, name, bonded_icx, registered_time, created_time)
	VALUES ('2c37741ffa', 1, 'Relay 1', 1000, (NOW() - interval '2 hour'), NOW());

INSERT INTO public.relay_candidates(
	id, rank, name, bonded_icx, registered_time, created_time)
	VALUES ('2c37741ffb', 2, 'Relay 2', 2000, (NOW() - interval '1 hour'), NOW());

INSERT INTO public.relay_candidates(
	id, rank, name, bonded_icx, registered_time, created_time)
	VALUES ('2c37741ffc', 3, 'Relay 3', 10450, NOW(), NOW());

INSERT INTO public.relay_candidates(
	id, rank, name, bonded_icx, registered_time, created_time)
	VALUES ('2c37741ffd', 4, 'Relay 4', 1010, NOW(), NOW());

INSERT INTO public.relay_candidates(
	id, rank, name, bonded_icx, registered_time, created_time)
	VALUES ('2c37741ffe', 5, 'Relay 5', 1010, NOW(), NOW());

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

-- Issue #37

INSERT INTO public.relay_candidate_rewards(
	id, rc_id, rc_address, reward_value, total_reward, created_time)
	VALUES ('2c37741ffa', '2c37741ffa', 'hxd007a51447a18021ed2d27e8cb4784febb0c9561', 100, 300, (NOW() - interval '30 days'));

INSERT INTO public.relay_candidate_rewards(
	id, rc_id, rc_address, reward_value, total_reward, created_time)
	VALUES ('2c37741ffb', '2c37741ffb', 'hxd007a51447a18021ed2d27e8cb4784febb0c9562', 200, 300, (NOW() - interval '30 days'));

INSERT INTO public.relay_candidate_rewards(
	id, rc_id, rc_address, reward_value, total_reward, created_time)
	VALUES ('2c37741faa', '2c37741ffa', 'hxd007a51447a18021ed2d27e8cb4784febb0c9561', 100, 900, NOW());

INSERT INTO public.relay_candidate_rewards(
	id, rc_id, rc_address, reward_value, total_reward, created_time)
	VALUES ('2c37741fab', '2c37741ffb', 'hxd007a51447a18021ed2d27e8cb4784febb0c9562', 200, 900, NOW());

INSERT INTO public.relay_candidate_rewards(
	id, rc_id, rc_address, reward_value, total_reward, created_time)
	VALUES ('2c37741fac', '2c37741ffc', 'hxeb62be05a3f276039e40b3e1bbb3c358d157de29', 300, 900, NOW());
