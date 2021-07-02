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
    CONSTRAINT bids_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.bids
    OWNER to postgres;

-- Table: public.relays

-- DROP TABLE public.relays;

CREATE TABLE IF NOT EXISTS public.relays
(
    id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    rank numeric NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    bonded_icx numeric NOT NULL,
    server_status numeric NOT NULL,
    total_transferred_tx numeric NOT NULL,
    total_failed_tx numeric NOT NULL,
    created_time timestamp without time zone NOT NULL,
    updated_time timestamp without time zone NOT NULL,
    CONSTRAINT relays_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.relays
    OWNER to postgres;

-- Table: public.icon_blocks

-- DROP TABLE public.icon_blocks;

CREATE TABLE IF NOT EXISTS public.icon_blocks
(
    block_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    block_height bigint NOT NULL,
    block_data text COLLATE pg_catalog."default" NOT NULL,
    created_time timestamp without time zone NOT NULL,
    CONSTRAINT icon_blocks_pkey PRIMARY KEY (block_hash)
)

TABLESPACE pg_default;

ALTER TABLE public.icon_blocks
    OWNER to postgres;

-- Table: public.moonbeam_blocks

-- DROP TABLE public.moonbeam_blocks;

CREATE TABLE IF NOT EXISTS public.moonbeam_blocks
(
    block_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    block_height bigint NOT NULL,
    block_data text COLLATE pg_catalog."default" NOT NULL,
    created_time timestamp without time zone NOT NULL,
    CONSTRAINT moonbeam_blocks_pkey PRIMARY KEY (block_hash)
)

TABLESPACE pg_default;

ALTER TABLE public.moonbeam_blocks
    OWNER to postgres;

-- Table: public.transfer_fees

-- DROP TABLE public.transfer_fees;

CREATE TABLE IF NOT EXISTS public.transfer_fees
(
    id character varying(10) COLLATE pg_catalog."default" NOT NULL,
    token_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    token_amount numeric NOT NULL,
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    created_time timestamp without time zone NOT NULL,
    CONSTRAINT transfer_fees_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.transfer_fees
    OWNER to postgres;
