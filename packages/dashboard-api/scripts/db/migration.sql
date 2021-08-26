-- Issue #171

ALTER TABLE transfer_fees
  ADD total_token_amount numeric NOT NULL DEFAULT 0,
  DROP token_amount_usd,
  DROP total_fee_usd

-- add default value for column total_token_amount
UPDATE transfer_fees SET total_token_amount=b.token_amount
FROM (SELECT id, token_amount FROM transfer_fees) AS b
WHERE transfer_fees.id=b.id

-- Issue #167
ALTER TABLE transactions
  ADD total_volume numeric NOT NULL DEFAULT 0

-- Issue #33

ALTER TABLE networks
    DROP COLUMN delete_at,
    ADD COLUMN native_token character varying(100);

ALTER TABLE networks
ALTER COLUMN create_at SET DATA TYPE timestamp without time zone USING to_timestamp(create_at),
ALTER COLUMN update_at SET DATA TYPE timestamp without time zone USING to_timestamp(update_at);

-- Issue #168

ALTER TABLE minted_tokens
DROP COLUMN delete_at,
DROP COLUMN update_at,
DROP COLUMN total_amount_usd,
ADD COLUMN total_token_amount numeric NOT NULL DEFAULT 0,
ALTER COLUMN create_at SET DATA TYPE timestamp without time zone USING to_timestamp(create_at);

-- Issue #153
ALTER TABLE transactions
ALTER COLUMN create_at SET DATA TYPE timestamp without time zone USING to_timestamp(create_at),
ALTER COLUMN update_at SET DATA TYPE timestamp without time zone USING to_timestamp(update_at);

-- Issue #170
CREATE TABLE public.relay_rewards (
    created_time timestamp without time zone NOT NULL,
    id character varying(100) NOT NULL,
    relay_id character varying(100) NOT NULL,
    reward_value numeric NOT NULL,
    update_time timestamp without time zone
);

ALTER TABLE ONLY public.relay_rewards
    ADD CONSTRAINT relay_rewards_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.relay_rewards
    ADD CONSTRAINT relay_rewards_relay_id_fkey FOREIGN KEY (relay_id) REFERENCES public.relay_candidates(id);

-- Issue #226

CREATE TABLE IF NOT EXISTS public.token_prices
(
    cmc_id integer NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    price numeric NOT NULL,
    active integer NOT NULL,
    created_time timestamp without time zone NOT NULL,
    updated_time timestamp without time zone NOT NULL,
    CONSTRAINT token_prices_pkey PRIMARY KEY (cmc_id),
    CONSTRAINT name_unique UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE public.token_prices
    OWNER to postgres;

-- Issue #224

ALTER TABLE ONLY public.transactions
    DROP CONSTRAINT transactions_serial_number_key

-- Issue #262

ALTER TABLE ONLY public.transactions
    ALTER COLUMN serial_number  TYPE character varying(50),
    ALTER COLUMN token_name  TYPE character varying(50),
    ALTER COLUMN value  TYPE numeric,
    ALTER COLUMN to_address  TYPE character varying(100),
    ALTER COLUMN from_address  TYPE character varying(100),
    ALTER COLUMN block_hash  TYPE character varying(100),
    ALTER COLUMN tx_hash  TYPE character varying(100),
    ALTER COLUMN network_id  TYPE character varying(20),
    ALTER COLUMN btp_fee  TYPE numeric,
    ALTER COLUMN network_fee  TYPE numeric,
    ALTER COLUMN total_volume  TYPE numeric,
    DROP COLUMN delete_at;

UPDATE transactions SET btp_fee=value * 0.01, network_fee=value * 0.0001

-- Issue #264

ALTER TABLE ONLY public.transactions
    ADD COLUMN tx_hash_end character varying(100),
    ADD COLUMN block_height_end integer,
    DROP COLUMN block_hash;


-- Issue #256
CREATE TABLE public.relays (
    id character varying(100) NOT NULL,
    address character varying(300) UNIQUE NOT NULL,
    link character varying(300) NOT NULL,
    server_status  character varying(20) NOT NULL,
    total_transferred_tx numeric NOT NULL,
    total_failed_tx numeric NOT NULL,
    registered_time timestamp without time zone NOT NULL,
    unregistered_time timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
);

ALTER TABLE ONLY public.relays
    ADD CONSTRAINT relays_pkey PRIMARY KEY (id);

-- Issue #269

ALTER TABLE ONLY public.transactions
    ADD COLUMN tx_error character varying(100);

-- Issue #38
ALTER TABLE ONLY public.relay_candidates
    ALTER COLUMN rank DROP NOT NULL,
    ADD COLUMN address character varying(300) UNIQUE NOT NULL,
    ADD COLUMN dest_address character varying(300) NOT NULL;
    DROP COLUMN server_status,
	DROP COLUMN total_transferred_tx,
	DROP COLUMN total_failed_tx,
	DROP COLUMN total_active;

-- Issue #37

-- drop relay_rewards
-- create relay_candidate_rewards
