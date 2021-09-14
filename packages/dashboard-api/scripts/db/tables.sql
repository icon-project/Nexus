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
    created_time timestamp without time zone NOT NULL,
    updated_time timestamp without time zone,
    winner_bid_amount numeric,
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT auctions_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.auctions
    OWNER to postgres;

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
    created_time timestamp without time zone NOT NULL,
    auction_id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT bids_pkey PRIMARY KEY (id),
    CONSTRAINT bids_auction_id_fkey FOREIGN KEY (auction_id)
        REFERENCES public.auctions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.bids
    OWNER to postgres;
-- Index: bids_auction_id

-- DROP INDEX public.bids_auction_id;

CREATE INDEX bids_auction_id
    ON public.bids USING btree
    (auction_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: bids_created_time

-- DROP INDEX public.bids_created_time;

CREATE INDEX bids_created_time
    ON public.bids USING btree
    (created_time DESC NULLS FIRST)
    TABLESPACE pg_default;

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
    create_at timestamp without time zone NOT NULL,
    update_at timestamp without time zone NOT NULL,
    native_token character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT networks_pkey PRIMARY KEY (id),
    CONSTRAINT native_token_key UNIQUE (native_token),
    CONSTRAINT networks_name_key UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE public.networks
    OWNER to postgres;

-- Table: public.token_info

-- DROP TABLE public.token_info;

CREATE TABLE IF NOT EXISTS public.token_info
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    network_id character varying(20) COLLATE pg_catalog."default" NOT NULL,
    token_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    token_id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    create_at timestamp without time zone NOT NULL,
    CONSTRAINT token_info_pkey PRIMARY KEY (id),
    CONSTRAINT token_info_network_id_token_name UNIQUE (network_id, token_name)
)

TABLESPACE pg_default;

ALTER TABLE public.token_info
    OWNER to postgres;
-- Index: token_info_token_id

-- DROP INDEX public.token_info_token_id;

CREATE INDEX token_info_token_id
    ON public.token_info USING btree
    (token_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.indexer_stats

-- DROP TABLE public.indexer_stats;

CREATE TABLE IF NOT EXISTS public.indexer_stats
(
    network_id character varying(10) COLLATE pg_catalog."default" NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    block_height integer NOT NULL,
    updated_time timestamp without time zone NOT NULL,
    CONSTRAINT indexer_stats_pkey PRIMARY KEY (network_id),
    CONSTRAINT indexer_stats_name_key UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE public.indexer_stats
    OWNER to postgres;

-- Table: public.token_prices

-- DROP TABLE public.token_prices;

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

-- Table: public.transfer_fees

-- DROP TABLE public.transfer_fees;

CREATE TABLE IF NOT EXISTS public.transfer_fees
(
    id character varying(10) COLLATE pg_catalog."default" NOT NULL,
    token_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    token_amount numeric NOT NULL,
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    total_token_amount numeric NOT NULL,
    created_time timestamp without time zone NOT NULL,
    CONSTRAINT transfer_fees_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.transfer_fees
    OWNER to postgres;
-- Index: transfer_fees_created_time

-- DROP INDEX public.transfer_fees_created_time;

CREATE INDEX transfer_fees_created_time
    ON public.transfer_fees USING btree
    (created_time DESC NULLS FIRST)
    TABLESPACE pg_default;
-- Index: transfer_fees_token_name

-- DROP INDEX public.transfer_fees_token_name;

CREATE INDEX transfer_fees_token_name
    ON public.transfer_fees USING btree
    (token_name COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.relays

-- DROP TABLE public.relays;

CREATE TABLE IF NOT EXISTS public.relays
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    link character varying(300) COLLATE pg_catalog."default" NOT NULL,
    total_transferred_tx numeric NOT NULL,
    total_failed_tx numeric NOT NULL,
    registered_time timestamp without time zone NOT NULL,
    unregistered_time timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    server_status character varying(20) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT relays_pkey PRIMARY KEY (id),
    CONSTRAINT relays_address_key UNIQUE (address)
)

TABLESPACE pg_default;

ALTER TABLE public.relays
    OWNER to postgres;
-- Index: relays_address

-- DROP INDEX public.relays_address;

CREATE INDEX relays_address
    ON public.relays USING btree
    (address COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: relays_registered_time

-- DROP INDEX public.relays_registered_time;

CREATE INDEX relays_registered_time
    ON public.relays USING btree
    (registered_time ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.relay_candidates

-- DROP TABLE public.relay_candidates;

CREATE TABLE IF NOT EXISTS public.relay_candidates
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    rank numeric NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    bonded_icx numeric NOT NULL,
    registered_time timestamp without time zone NOT NULL,
    unregistered_time timestamp without time zone,
    created_time timestamp without time zone NOT NULL,
    updated_time timestamp without time zone,
    address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    dest_address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT relay_candidates_pkey PRIMARY KEY (id),
    CONSTRAINT relay_candidates_address_key UNIQUE (address)
)

TABLESPACE pg_default;

ALTER TABLE public.relay_candidates
    OWNER to postgres;
-- Index: relay_candidates_address

-- DROP INDEX public.relay_candidates_address;

CREATE INDEX relay_candidates_address
    ON public.relay_candidates USING btree
    (address COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.relay_candidate_rewards

-- DROP TABLE public.relay_candidate_rewards;

CREATE TABLE IF NOT EXISTS public.relay_candidate_rewards
(
    id character varying(50) COLLATE pg_catalog."default" NOT NULL,
    rc_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
    rc_address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    reward_value numeric NOT NULL,
    total_reward numeric NOT NULL,
    created_time timestamp without time zone NOT NULL,
    CONSTRAINT relay_rewards_pkey PRIMARY KEY (id),
    CONSTRAINT relay_rewards_relay_id_fkey FOREIGN KEY (rc_id)
        REFERENCES public.relay_candidates (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.relay_candidate_rewards
    OWNER to postgres;
-- Index: relay_candidate_rewards_created_time

-- DROP INDEX public.relay_candidate_rewards_created_time;

CREATE INDEX relay_candidate_rewards_created_time
    ON public.relay_candidate_rewards USING btree
    (created_time DESC NULLS FIRST)
    TABLESPACE pg_default;

-- Table: public.minted_tokens

-- DROP TABLE public.minted_tokens;

CREATE TABLE IF NOT EXISTS public.minted_tokens
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    network_id character varying(20) COLLATE pg_catalog."default" NOT NULL,
    token_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    token_value numeric NOT NULL,
    total_token_amount numeric NOT NULL,
    block_time bigint NOT NULL,
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    create_at timestamp without time zone NOT NULL,
    mint_to character varying(100) COLLATE pg_catalog."default" NOT NULL,
    token_id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT minted_tokens_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.minted_tokens
    OWNER to postgres;
-- Index: minted_tokens_create_at

-- DROP INDEX public.minted_tokens_create_at;

CREATE INDEX minted_tokens_create_at
    ON public.minted_tokens USING btree
    (create_at DESC NULLS FIRST)
    TABLESPACE pg_default;
-- Index: minted_tokens_token_name

-- DROP INDEX public.minted_tokens_token_name;

CREATE INDEX minted_tokens_token_name
    ON public.minted_tokens USING btree
    (token_name COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.burned_tokens

-- DROP TABLE public.burned_tokens;

CREATE TABLE IF NOT EXISTS public.burned_tokens
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    network_id character varying(20) COLLATE pg_catalog."default" NOT NULL,
    token_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    token_value numeric NOT NULL,
    total_token_amount numeric NOT NULL,
    block_time bigint NOT NULL,
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    create_at timestamp without time zone NOT NULL,
    burn_from character varying(100) COLLATE pg_catalog."default" NOT NULL,
    token_id character varying(100) COLLATE pg_catalog."default" NOT NULL
)

TABLESPACE pg_default;

ALTER TABLE public.burned_tokens
    OWNER to postgres;
-- Index: burned_tokens_create_at

-- DROP INDEX public.burned_tokens_create_at;

CREATE INDEX burned_tokens_create_at
    ON public.burned_tokens USING btree
    (create_at DESC NULLS FIRST)
    TABLESPACE pg_default;
-- Index: burned_tokens_token_name

-- DROP INDEX public.burned_tokens_token_name;

CREATE INDEX burned_tokens_token_name
    ON public.burned_tokens USING btree
    (token_name COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.transactions

-- DROP TABLE public.transactions;

CREATE TABLE IF NOT EXISTS public.transactions
(
    id character varying(37) COLLATE pg_catalog."default" NOT NULL,
    serial_number character varying(50) COLLATE pg_catalog."default" NOT NULL,
    token_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    value numeric NOT NULL,
    to_address character varying(100) COLLATE pg_catalog."default",
    from_address character varying(100) COLLATE pg_catalog."default",
    tx_hash character varying(100) COLLATE pg_catalog."default",
    create_at timestamp without time zone NOT NULL,
    update_at timestamp without time zone,
    network_id character varying(20) COLLATE pg_catalog."default" NOT NULL,
    block_time bigint NOT NULL,
    btp_fee numeric NOT NULL,
    network_fee numeric NOT NULL,
    status integer NOT NULL DEFAULT 0,
    total_volume numeric NOT NULL DEFAULT 0,
    tx_hash_end character varying(100) COLLATE pg_catalog."default",
    tx_error character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT transactions_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.transactions
    OWNER to postgres;
-- Index: transactions_block_time

-- DROP INDEX public.transactions_block_time;

CREATE INDEX transactions_block_time
    ON public.transactions USING btree
    (block_time ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: transactions_network_id

-- DROP INDEX public.transactions_network_id;

CREATE INDEX transactions_network_id
    ON public.transactions USING btree
    (network_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: transactions_serial_number

-- DROP INDEX public.transactions_serial_number;

CREATE INDEX transactions_serial_number
    ON public.transactions USING btree
    (serial_number COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: transactions_token_name

-- DROP INDEX public.transactions_token_name;

CREATE INDEX transactions_token_name
    ON public.transactions USING btree
    (token_name COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: transactions_update_at

-- DROP INDEX public.transactions_update_at;

CREATE INDEX transactions_update_at
    ON public.transactions USING btree
    (update_at DESC NULLS FIRST)
    TABLESPACE pg_default;
