INSERT INTO public.relays(
	id, rank, name, bonded_icx, server_status, total_transferred_tx, total_failed_tx, created_time, updated_time)
	VALUES ('2c37741ffa', 1, 'Relay 1', 1000, 1, 100, 0, NOW(), NOW());

INSERT INTO public.relays(
	id, rank, name, bonded_icx, server_status, total_transferred_tx, total_failed_tx, created_time, updated_time)
	VALUES ('2c37741ffb', 2, 'Relay 2', 2000, 2, 1000, 10, NOW(), NOW());

INSERT INTO public.relays(
	id, rank, name, bonded_icx, server_status, total_transferred_tx, total_failed_tx, created_time, updated_time)
	VALUES ('2c37741ffc', 3, 'Relay 3', 10450, 3, 101230, 210, NOW(), NOW());
