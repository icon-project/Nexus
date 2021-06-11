-- Table: public.auctions

-- DROP TABLE public.auctions;

CREATE TABLE IF NOT EXISTS public.auctions
(
    id bigint NOT NULL,
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    token_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    bidder_address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    bid_amount numeric NOT NULL,
    end_time timestamp without time zone NOT NULL,
    winner_address character varying(100) COLLATE pg_catalog."default",
    token_amount numeric,
    tx_hash_ended character varying(100) COLLATE pg_catalog."default",
    created_time timestamp without time zone NOT NULL,
    updated_time timestamp without time zone,
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
    auction_id bigint NOT NULL,
    token_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    current_bidder_address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    current_bid_amount numeric NOT NULL,
    new_bidder_address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    new_bid_amount numeric NOT NULL,
    tx_hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    created_time timestamp without time zone NOT NULL,
    CONSTRAINT bids_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.bids
    OWNER to postgres;

-- Table: public.relays

-- DROP TABLE public.relays;

CREATE TABLE IF NOT EXISTS public.relays
(
    id bigint NOT NULL,
    CONSTRAINT relays_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.relays
    OWNER to postgres;
