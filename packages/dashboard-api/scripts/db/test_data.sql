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

-- Issue #385

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address)
	VALUES ('2c645591-26ef-4652-a4eb-2475d1043261', '0x101c5b', 'ETH', '0x8f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd', '0x8fabd9ad200497d59f0e2528772d2df8e98093ca3645b821d78286056e9a7c9e', NOW(), 'cx77622c6d0bcd80048eb159aa99fd30df2f38c97f', 'cxe32aa9a25c3a934134db8dd6749832fee8b45834');

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at, contract_address, token_address)
VALUES ('348ed102-34e7-4e75-881b-8dd1742adf33', '0x501', 'ICX', '0x74645123150620096120801602238006067452189572593452417212166420008730219938226', '0xb5b49cd71c1d403db3cb0e7a0a8eeddf8fba93eb15930709ca5583912fc64d6c', NOW(), '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963', '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963')
