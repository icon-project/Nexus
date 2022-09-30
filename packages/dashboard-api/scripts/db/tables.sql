-- Table: public.auctions

-- DROP TABLE public.auctions;

CREATE TABLE IF NOT EXISTS public.auctions
(
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    token_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    bidder_address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    bid_amount numeric NOT NULL,
    end_time timestamp without time zone NOT NULL,
    winner_address character varying(100) COLLATE pg_catalog."default",
    token_amount numeric NOT NULL,
    tx_hash_ended character varying(100) COLLATE pg_catalog."default",
    created_time timestamp without time zone NOT NULL DEFAULT now(),
    updated_time timestamp without time zone,
    winner_bid_amount numeric,
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT auctions_pkey PRIMARY KEY (id)
);

-- Table: public.bids

-- DROP TABLE public.bids;

CREATE TABLE IF NOT EXISTS public.bids
(
    id character(10) COLLATE pg_catalog."default" NOT NULL,
    token_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    current_bidder_address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    current_bid_amount numeric NOT NULL,
    new_bidder_address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    new_bid_amount numeric NOT NULL,
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    created_time timestamp without time zone NOT NULL DEFAULT now(),
    auction_id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT bids_pkey PRIMARY KEY (id),
    CONSTRAINT bids_auction_id_fkey FOREIGN KEY (auction_id)
        REFERENCES public.auctions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- Index: bids_auction_id

-- DROP INDEX public.bids_auction_id;

CREATE INDEX bids_auction_id
    ON public.bids USING btree
    (auction_id ASC NULLS LAST);

-- Index: bids_created_time

-- DROP INDEX public.bids_created_time;

CREATE INDEX bids_created_time
    ON public.bids USING btree
    (created_time DESC NULLS FIRST);


-- Table: public.networks

-- DROP TABLE public.networks;

CREATE TABLE IF NOT EXISTS public.networks
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
);

-- Table: public.registered_tokens

-- DROP TABLE public.registered_tokens;

CREATE TABLE IF NOT EXISTS public.registered_tokens
(
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    network_id character varying(20) COLLATE pg_catalog."default" NOT NULL,
    token_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    contract_address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    create_at timestamp without time zone NOT NULL DEFAULT now(),
    token_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
    active integer NOT NULL DEFAULT 1,
    CONSTRAINT registered_tokens_pkey PRIMARY KEY (tx_hash),
    CONSTRAINT registered_tokens_network_id_token_name UNIQUE (network_id, token_name)
);

-- Table: public.indexer_stats

-- DROP TABLE public.indexer_stats;

CREATE TABLE IF NOT EXISTS public.indexer_stats
(
    network_id character varying(10) COLLATE pg_catalog."default" NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    block_height integer NOT NULL DEFAULT 0,
    create_at timestamp without time zone NOT NULL DEFAULT now(),
    update_at timestamp without time zone,
    CONSTRAINT indexer_stats_pkey PRIMARY KEY (network_id),
    CONSTRAINT indexer_stats_name_key UNIQUE (name)
);

-- Table: public.token_prices

-- DROP TABLE public.token_prices;

CREATE TABLE IF NOT EXISTS public.token_prices
(
    cmc_id integer NOT NULL,
    name character varying(50) NOT NULL,
    price numeric NOT NULL,
    active integer NOT NULL,
    created_time timestamp without time zone NOT NULL DEFAULT now(),
    updated_time timestamp without time zone,
    CONSTRAINT token_prices_pkey PRIMARY KEY (cmc_id),
    CONSTRAINT name_unique UNIQUE (name)
);

-- Table: public.transfer_fees

-- DROP TABLE public.transfer_fees;

CREATE TABLE IF NOT EXISTS public.transfer_fees
(
    id character varying(10) NOT NULL,
    token_name character varying(50) NOT NULL,
    token_amount numeric NOT NULL,
    tx_hash character varying(100) NOT NULL,
    total_token_amount numeric NOT NULL,
    created_time timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT transfer_fees_pkey PRIMARY KEY (id)
);

-- Index: transfer_fees_created_time

-- DROP INDEX public.transfer_fees_created_time;

CREATE INDEX transfer_fees_created_time
    ON public.transfer_fees USING btree
    (created_time DESC NULLS FIRST);

-- Index: transfer_fees_token_name

-- DROP INDEX public.transfer_fees_token_name;

CREATE INDEX transfer_fees_token_name
    ON public.transfer_fees USING btree
    (token_name ASC NULLS LAST);


-- Table: public.relays

-- DROP TABLE public.relays;

CREATE TABLE IF NOT EXISTS public.relays
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
);

-- Index: relays_address

-- DROP INDEX public.relays_address;

CREATE INDEX relays_address
    ON public.relays USING btree
    (address ASC NULLS LAST);

-- Index: relays_registered_time

-- DROP INDEX public.relays_registered_time;

CREATE INDEX relays_registered_time
    ON public.relays USING btree
    (registered_time ASC NULLS LAST);


-- Table: public.relay_candidates

-- DROP TABLE public.relay_candidates;

CREATE TABLE IF NOT EXISTS public.relay_candidates
(
    rank numeric NOT NULL DEFAULT 0,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    bonded_icx numeric NOT NULL,
    total_reward numeric NOT NULL DEFAULT 0,
    registered_time timestamp without time zone NOT NULL,
    unregistered_time timestamp without time zone,
    created_time timestamp without time zone NOT NULL DEFAULT now(),
    updated_time timestamp without time zone,
    address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    tx_hash_unregistered character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT relay_candidates_pkey PRIMARY KEY (tx_hash),
    CONSTRAINT relay_candidates_address_key UNIQUE (address)
));

-- Table: public.relay_candidate_rewards

CREATE TABLE IF NOT EXISTS public.relay_candidate_rewards
(
    id character(10) COLLATE pg_catalog."default" NOT NULL,
    total_reward numeric NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT relay_candidate_rewards_pkey PRIMARY KEY (id)
);

-- Table: public.minted_tokens

-- DROP TABLE public.minted_tokens;

CREATE TABLE IF NOT EXISTS public.minted_tokens
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
);

-- Index: minted_tokens_create_at

-- DROP INDEX public.minted_tokens_create_at;

CREATE INDEX minted_tokens_create_at
    ON public.minted_tokens USING btree
    (create_at DESC NULLS FIRST);

-- Index: minted_tokens_token_name

-- DROP INDEX public.minted_tokens_token_name;

CREATE INDEX minted_tokens_token_name
    ON public.minted_tokens USING btree
    (token_name ASC NULLS LAST);


-- Table: public.burned_tokens

-- DROP TABLE public.burned_tokens;

CREATE TABLE IF NOT EXISTS public.burned_tokens
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
);

-- Index: burned_tokens_create_at

-- DROP INDEX public.burned_tokens_create_at;

CREATE INDEX burned_tokens_create_at
    ON public.burned_tokens USING btree
    (create_at DESC NULLS FIRST);

-- Index: burned_tokens_token_name

-- DROP INDEX public.burned_tokens_token_name;

CREATE INDEX burned_tokens_token_name
    ON public.burned_tokens USING btree
    (token_name ASC NULLS LAST);


-- Table: public.transactions

-- DROP TABLE public.transactions;

CREATE TABLE IF NOT EXISTS public.transactions
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
);

-- Index: transactions_block_time

-- DROP INDEX public.transactions_block_time;

CREATE INDEX transactions_block_time
    ON public.transactions USING btree
    (block_time ASC NULLS LAST);

-- Index: transactions_network_id

-- DROP INDEX public.transactions_network_id;

CREATE INDEX transactions_network_id
    ON public.transactions USING btree
    (network_id ASC NULLS LAST);

-- Index: transactions_serial_number

-- DROP INDEX public.transactions_serial_number;

CREATE INDEX transactions_serial_number
    ON public.transactions USING btree
    (serial_number ASC NULLS LAST);

-- Index: transactions_token_name

-- DROP INDEX public.transactions_token_name;

CREATE INDEX transactions_token_name
    ON public.transactions USING btree
    (token_name ASC NULLS LAST);

-- Index: transactions_update_at

-- DROP INDEX public.transactions_update_at;

CREATE INDEX transactions_update_at
    ON public.transactions USING btree
    (update_at DESC NULLS FIRST);
