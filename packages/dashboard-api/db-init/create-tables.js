/* eslint-disable quotes */
/* eslint-disable indent */
const createDatabaseQuery = [
// -- Table: public.burned_tokens
`CREATE TABLE IF NOT EXISTS public.burned_tokens
(
    network_id character varying(20) NOT NULL,
    token_name character varying(50) NOT NULL,
    token_value numeric NOT NULL,
    total_token_amount numeric NOT NULL,
    block_time bigint NOT NULL,
    tx_hash character varying(100) NOT NULL,
    create_at timestamp without time zone NOT NULL DEFAULT now(),
    burn_from character varying(100) NOT NULL,
    log_id character varying(50),
    CONSTRAINT burned_tokens_pkey PRIMARY KEY (tx_hash)
);`,

// -- Table: public.indexer_stats
`CREATE TABLE IF NOT EXISTS public.indexer_stats
(
    network_id character varying(10) COLLATE pg_catalog."default" NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    block_height integer NOT NULL DEFAULT 0,
    create_at timestamp without time zone NOT NULL DEFAULT now(),
    update_at timestamp without time zone,
    CONSTRAINT indexer_stats_pkey PRIMARY KEY (network_id),
    CONSTRAINT indexer_stats_name_key UNIQUE (name)
);`,

// -- Table: public.minted_tokens
`CREATE TABLE IF NOT EXISTS public.minted_tokens
(
    network_id character varying(20) NOT NULL,
    token_name character varying(50) NOT NULL,
    token_value numeric NOT NULL,
    total_token_amount numeric NOT NULL,
    block_time bigint NOT NULL,
    tx_hash character varying(100) NOT NULL,
    create_at timestamp without time zone NOT NULL DEFAULT now(),
    mint_to character varying(100) NOT NULL,
    log_id character varying(50),
    CONSTRAINT minted_tokens_pkey PRIMARY KEY (tx_hash)
);`,

// -- Table: public.networks
`CREATE TABLE IF NOT EXISTS public.networks
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    path_logo character varying(100) COLLATE pg_catalog."default" NOT NULL,
    url character varying(100) COLLATE pg_catalog."default" NOT NULL,
    mint_fee numeric NOT NULL DEFAULT 0,
    burn_fee numeric NOT NULL DEFAULT 0,
    create_at timestamp without time zone NOT NULL DEFAULT now(),
    update_at timestamp without time zone,
    native_token character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT networks_pkey PRIMARY KEY (id),
    CONSTRAINT native_token_key UNIQUE (native_token),
    CONSTRAINT networks_name_key UNIQUE (name)
);`,

// -- Table: public.relay_candidate_rewards
`CREATE TABLE IF NOT EXISTS public.relay_candidate_rewards
(
    id character(10) COLLATE pg_catalog."default" NOT NULL,
    total_reward numeric NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT relay_candidate_rewards_pkey PRIMARY KEY (id)
);`,
// -- Table: public.relay_candidates
`CREATE TABLE IF NOT EXISTS public.relay_candidates
(
    rank numeric NOT NULL DEFAULT 0,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    bonded_icx numeric NOT NULL,
    registered_time timestamp without time zone NOT NULL,
    unregistered_time timestamp without time zone,
    created_time timestamp without time zone NOT NULL DEFAULT now(),
    updated_time timestamp without time zone,
    address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    tx_hash_unregistered character varying(100) COLLATE pg_catalog."default",
    total_reward numeric NOT NULL DEFAULT 0,
    CONSTRAINT relay_candidates_pkey PRIMARY KEY (tx_hash),
    CONSTRAINT relay_candidates_address_key UNIQUE (address)
);`,

// -- Table: public.relays
`CREATE TABLE IF NOT EXISTS public.relays
(
    address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    link character varying(300) COLLATE pg_catalog."default" NOT NULL,
    total_transferred_tx numeric NOT NULL DEFAULT 0,
    total_failed_tx numeric NOT NULL DEFAULT 0,
    registered_time timestamp without time zone NOT NULL,
    unregistered_time timestamp without time zone,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone,
    server_status character varying(20) COLLATE pg_catalog."default" NOT NULL,
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT relays_pkey PRIMARY KEY (tx_hash),
    CONSTRAINT relays_address_key UNIQUE (address)
);`,

// -- Table: public.token_prices
`CREATE TABLE IF NOT EXISTS public.token_prices
(
    coingecko_id character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    price numeric NOT NULL,
    active integer NOT NULL,
    created_time timestamp without time zone NOT NULL DEFAULT now(),
    updated_time timestamp without time zone,
    CONSTRAINT token_prices_pkey PRIMARY KEY (coingecko_id),
    CONSTRAINT name_unique UNIQUE (name)
);`,

// -- Table: public.transactions
`CREATE TABLE IF NOT EXISTS public.transactions
(
    serial_number character varying(50) COLLATE pg_catalog."default" NOT NULL,
    token_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    value numeric NOT NULL,
    to_address character varying(100) COLLATE pg_catalog."default",
    from_address character varying(100) COLLATE pg_catalog."default",
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    create_at timestamp without time zone NOT NULL DEFAULT now(),
    update_at timestamp without time zone,
    network_id character varying(20) COLLATE pg_catalog."default" NOT NULL,
    block_time bigint NOT NULL,
    btp_fee numeric NOT NULL,
    network_fee numeric NOT NULL,
    status integer NOT NULL DEFAULT 0,
    total_volume numeric NOT NULL DEFAULT 0,
    tx_hash_end character varying(100) COLLATE pg_catalog."default",
    tx_error character varying(100) COLLATE pg_catalog."default",
    contract_address character varying(100) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    log_id1 character varying(50),
    log_id2 character varying(50),
    CONSTRAINT transactions_pkey PRIMARY KEY (tx_hash),
    CONSTRAINT transactions_serial_network_contract_key UNIQUE (serial_number, network_id, contract_address)
);`,
// -- Table: public.transfer_fees
`CREATE TABLE IF NOT EXISTS public.transfer_fees
(
    id character varying(10) NOT NULL,
    token_name character varying(50) NOT NULL,
    token_amount numeric NOT NULL,
    tx_hash character varying(100) NOT NULL,
    total_token_amount numeric NOT NULL,
    created_time timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT transfer_fees_pkey PRIMARY KEY (id)
);`,

// -- Index database --
`CREATE INDEX burned_tokens_create_at ON burned_tokens (create_at DESC);`,
`CREATE INDEX burned_tokens_token_name ON burned_tokens (token_name);`,
`CREATE INDEX minted_tokens_create_at ON minted_tokens (create_at DESC);`,
`CREATE INDEX minted_tokens_token_name ON minted_tokens (token_name);`,
`CREATE INDEX relay_candidates_address ON relay_candidates (address);`,
`CREATE INDEX relays_address ON relays (address);`,
`CREATE INDEX relays_registered_time ON relays (registered_time);`,
`CREATE INDEX transactions_block_time ON transactions (block_time);`,
`CREATE INDEX transactions_network_id ON transactions (network_id);`,
`CREATE INDEX transactions_serial_number ON transactions (serial_number);`,
`CREATE INDEX transactions_token_name ON transactions (token_name);`,
`CREATE INDEX transactions_update_at ON transactions (update_at DESC);`,
`CREATE INDEX transfer_fees_created_time ON transfer_fees (created_time DESC);`,
`CREATE INDEX transfer_fees_token_name ON transfer_fees (token_name);`,

// -- Create transaction_ips table for pushing a slack notification (log transaction to slack) --
`CREATE TABLE IF NOT EXISTS public.transaction_ips
(
    tx_hash character varying(100) NOT NULL,
	ip character varying(50),
    network_id character varying(20) NOT NULL,
    sent_to_slack boolean NOT NULL DEFAULT true,
    data json,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone,
	CONSTRAINT transaction_ip_pkey PRIMARY KEY (tx_hash, network_id)
)`

];

module.exports = {
    createDatabaseQuery
};
