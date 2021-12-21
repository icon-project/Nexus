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

-- Issue #282

ALTER TABLE public.minted_tokens
    ALTER COLUMN network_id TYPE character varying(20),
    ALTER COLUMN network_id SET NOT NULL,
    ALTER COLUMN token_name TYPE character varying(50),
    ALTER COLUMN token_name SET NOT NULL,
    ALTER COLUMN token_value SET NOT NULL,
    ALTER COLUMN block_time SET NOT NULL,
    ALTER COLUMN tx_hash SET NOT NULL,
    ALTER COLUMN mint_to TYPE character varying(100),
    ALTER COLUMN mint_to SET NOT NULL,
    ALTER COLUMN token_id TYPE character varying(100),
    ALTER COLUMN token_id SET NOT NULL;

ALTER TABLE public.burned_tokens
    ALTER COLUMN network_id TYPE character varying(20),
    ALTER COLUMN network_id SET NOT NULL,
    ALTER COLUMN token_name TYPE character varying(50),
    ALTER COLUMN token_name SET NOT NULL,
    ALTER COLUMN token_value SET NOT NULL,
    ALTER COLUMN block_time SET NOT NULL,
    ALTER COLUMN tx_hash SET NOT NULL,
    ALTER COLUMN burn_from TYPE character varying(100),
    ALTER COLUMN burn_from SET NOT NULL,
    ALTER COLUMN token_id TYPE character varying(100),
    ALTER COLUMN token_id SET NOT NULL,
    DROP COLUMN block_height,
    DROP COLUMN block_hash;

ALTER TABLE public.networks
    ALTER COLUMN name TYPE character varying(50),
    ALTER COLUMN path_logo SET NOT NULL,
    ALTER COLUMN url SET NOT NULL,
    ALTER COLUMN mint_fee SET NOT NULL,
    ALTER COLUMN mint_fee SET DEFAULT 0,
    ALTER COLUMN burn_fee SET NOT NULL,
    ALTER COLUMN burn_fee SET DEFAULT 0,
    ALTER COLUMN native_token TYPE character varying(50),
    ALTER COLUMN native_token SET NOT NULL;

ALTER TABLE public.relay_candidates
    ALTER COLUMN rank SET NOT NULL,
    ALTER COLUMN address TYPE character varying(100),
    ALTER COLUMN dest_address TYPE character varying(100);

ALTER TABLE public.relays
    ALTER COLUMN address TYPE character varying(100);

ALTER TABLE public.transactions
    ALTER COLUMN token_name SET NOT NULL,
    ALTER COLUMN value SET NOT NULL,
    ALTER COLUMN create_at SET NOT NULL,
    ALTER COLUMN network_id SET NOT NULL,
    ALTER COLUMN block_time SET NOT NULL,
    ALTER COLUMN btp_fee SET NOT NULL,
    ALTER COLUMN network_fee SET NOT NULL,
    ALTER COLUMN status SET NOT NULL,
    DROP COLUMN block_height,
    DROP COLUMN block_height_end;

CREATE TABLE IF NOT EXISTS public.token_info
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    network_id character varying(20) COLLATE pg_catalog."default" NOT NULL,
    token_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    token_id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    create_at timestamp without time zone NOT NULL,
    CONSTRAINT token_info_pkey PRIMARY KEY (id),
    CONSTRAINT token_info_network_id_token_name UNIQUE (network_id, token_name),
    CONSTRAINT token_info_network_id_fkey FOREIGN KEY (network_id)
        REFERENCES public.networks (id) MATCH SIMPLE
)

INSERT INTO token_info (id, network_id, token_name, token_id, tx_hash, create_at)
    SELECT id, network_id, token_name, token_id, tx_hash, create_at
    FROM tokens_info;

DROP TABLE public.tokens_info;

ALTER TABLE public.bids
    ADD CONSTRAINT bids_auction_id_fkey FOREIGN KEY (auction_id) REFERENCES public.auctions(id);

ALTER TABLE public.burned_tokens
    ADD CONSTRAINT burned_tokens_network_id_fkey FOREIGN KEY (network_id) REFERENCES public.networks(id);

ALTER TABLE public.indexer_stats
    ADD CONSTRAINT indexer_stats_name_key UNIQUE (name);

ALTER TABLE public.minted_tokens
    ADD CONSTRAINT minted_tokens_network_id_fkey FOREIGN KEY (network_id) REFERENCES public.networks(id);

ALTER TABLE public.networks
    ADD CONSTRAINT networks_name_key UNIQUE (name),
    ADD CONSTRAINT native_token_key UNIQUE (native_token);

CREATE INDEX minted_tokens_token_name ON minted_tokens (token_name);
CREATE INDEX burned_tokens_token_name ON burned_tokens (token_name);
CREATE INDEX minted_tokens_create_at ON minted_tokens (create_at DESC);
CREATE INDEX burned_tokens_create_at ON burned_tokens (create_at DESC);
CREATE INDEX token_info_token_id ON token_info (token_id);
CREATE INDEX relay_candidates_address ON relay_candidates (address);
CREATE INDEX transfer_fees_token_name ON transfer_fees (token_name);
CREATE INDEX transfer_fees_created_time ON transfer_fees (created_time DESC);
CREATE INDEX relays_address ON relays (address);
CREATE INDEX relays_registered_time ON relays (registered_time);
CREATE INDEX transactions_token_name ON transactions (token_name);
CREATE INDEX transactions_update_at ON transactions (update_at DESC);
CREATE INDEX transactions_serial_number ON transactions (serial_number);
CREATE INDEX transactions_network_id ON transactions (network_id);
CREATE INDEX transactions_block_time ON transactions (block_time);
CREATE INDEX bids_auction_id ON bids (auction_id);
CREATE INDEX bids_created_time ON bids (created_time DESC);
CREATE INDEX relay_candidate_rewards_created_time ON relay_candidate_rewards (created_time DESC);

-- Issue #315

DROP TABLE public.icon_blocks;
DROP TABLE public.moonbeam_blocks;

-- Issue #339

ALTER TABLE public.transactions
    ADD CONSTRAINT transactions_serial_number_network_id_key UNIQUE (serial_number, network_id);

-- Issue #322

ALTER TABLE public.transactions
    DROP COLUMN id,
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (tx_hash);

-- Issue #385

ALTER TABLE ONLY public.token_info
    ADD COLUMN token_address character varying(100) NOT NULL DEFAULT '',
    ADD COLUMN contract_address character varying(100) NOT NULL DEFAULT '';

-- Issue #312

ALTER TABLE ONLY public.transactions
    ADD COLUMN block_hash character varying(100),
    ADD COLUMN block_hash_end character varying(100);

-- Issue #426

ALTER TABLE ONLY public.transactions
    ADD COLUMN contract_address character varying(100) NOT NULL DEFAULT '',
    DROP CONSTRAINT transactions_serial_number_network_id_key,
    ADD CONSTRAINT transactions_serial_network_contract_key UNIQUE (serial_number, network_id, contract_address);

-- Issue #488

DROP TABLE relay_candidate_rewards;

CREATE TABLE IF NOT EXISTS public.relay_candidate_rewards
(
    id character(10) COLLATE pg_catalog."default" NOT NULL,
    total_reward numeric NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT relay_candidate_rewards_pkey PRIMARY KEY (id)
);

ALTER TABLE relay_candidates
    DROP COLUMN id,
    DROP COLUMN dest_address;

ALTER TABLE relay_candidates
    ADD COLUMN tx_hash character varying(100) NOT NULL,
    ADD COLUMN tx_hash_unregistered character varying(100),
    ALTER COLUMN created_time SET DEFAULT NOW(),
    ALTER COLUMN rank SET DEFAULT 0,
    ADD COLUMN total_reward numeric NOT NULL DEFAULT 0,
    ADD CONSTRAINT relay_candidates_pkey PRIMARY KEY (tx_hash);

-- Issue #380

ALTER TABLE transactions
    DROP COLUMN block_hash,
    DROP COLUMN block_hash_end;

ALTER TABLE relays
    DROP COLUMN id,
    ADD COLUMN tx_hash character varying(100);

UPDATE relays SET tx_hash=address;

ALTER TABLE relays
    ALTER COLUMN tx_hash SET NOT NULL,
    ALTER COLUMN total_transferred_tx SET DEFAULT 0,
    ALTER COLUMN total_failed_tx SET DEFAULT 0,
    ALTER COLUMN created_at SET DEFAULT NOW(),
    ADD CONSTRAINT relays_pkey PRIMARY KEY (tx_hash);

CREATE TABLE registered_tokens
(
    tx_hash character varying(100) NOT NULL,
    network_id character varying(20) NOT NULL,
    token_id character varying(100) NOT NULL,
    token_name character varying(50) NOT NULL,
    token_address character varying(100) NOT NULL,
    contract_address character varying(100) NOT NULL,
    create_at timestamp without time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT registered_tokens_pkey PRIMARY KEY (tx_hash),
    CONSTRAINT registered_tokens_network_id_token_name UNIQUE (network_id, token_name)
);

INSERT INTO registered_tokens (tx_hash, network_id, token_id, token_name, token_address, contract_address)
	SELECT tx_hash, network_id, token_id, token_name, token_address, contract_address FROM token_info;

DROP TABLE token_info;

-- Issue #493

ALTER TABLE auctions
    ALTER COLUMN created_time SET DEFAULT NOW();

ALTER TABLE bids
    ALTER COLUMN created_time SET DEFAULT NOW();

ALTER TABLE networks
    ALTER COLUMN create_at SET DEFAULT NOW(),
    ALTER COLUMN update_at DROP NOT NULL;

ALTER TABLE indexer_stats
    ADD COLUMN create_at timestamp without time zone NOT NULL DEFAULT NOW();

ALTER TABLE token_prices
    ALTER COLUMN created_time SET DEFAULT NOW(),
    ALTER COLUMN updated_time DROP NOT NULL;

ALTER TABLE transfer_fees
    ALTER COLUMN created_time SET DEFAULT NOW();

ALTER TABLE minted_tokens
    ALTER COLUMN create_at SET DEFAULT NOW();

ALTER TABLE burned_tokens
    ALTER COLUMN create_at SET DEFAULT NOW();

-- Issue #380

ALTER TABLE minted_tokens
    DROP COLUMN id;

ALTER TABLE minted_tokens
    ADD CONSTRAINT minted_tokens_pkey PRIMARY KEY (tx_hash);

ALTER TABLE burned_tokens
    DROP COLUMN id,
    ADD CONSTRAINT burned_tokens_pkey PRIMARY KEY (tx_hash);
