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
