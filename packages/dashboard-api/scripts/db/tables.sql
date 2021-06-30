-- Table: public.minted_tokens

-- DROP TABLE public.minted_tokens;

CREATE TABLE IF NOT EXISTS public.minted_tokens (
    id character varying(100) PRIMARY KEY,
    network_id character varying(100),
    token_name character varying(100),
    token_value numeric,
    block_time bigint,
    tx_hash character varying(100),
    block_hash character varying(100),
    block_height bigint,
    create_at integer,
    update_at integer,
    delete_at integer
);

-- Table: public.networks

-- DROP TABLE public.networks;

CREATE TABLE IF NOT EXISTS public.networks (
   id character varying(100) PRIMARY KEY,
   name character varying(4000) NOT NULL,
   path_logo character varying(100),
   url character varying(100),
   mint_fee numeric,
   burn_fee numeric,
   create_at integer,
   update_at integer,
   delete_at integer
);

ALTER TABLE networks
ALTER COLUMN id TYPE char varying(100);

SELECT SUM(value) FROM Transactions WHERE Confirmed = true

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
