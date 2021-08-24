--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3 (Debian 13.3-1.pgdg100+1)
-- Dumped by pg_dump version 13.3

-- Started on 2021-07-08 06:56:38 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 201 (class 1259 OID 16455)
-- Name: auctions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auctions (
    tx_hash character varying(100) NOT NULL,
    token_name character varying(50) NOT NULL,
    bidder_address character varying(100) NOT NULL,
    bid_amount numeric NOT NULL,
    end_time timestamp without time zone NOT NULL,
    winner_address character varying(100),
    token_amount numeric NOT NULL,
    tx_hash_ended character varying(100),
    created_time timestamp without time zone NOT NULL,
    updated_time timestamp without time zone,
    winner_bid_amount numeric,
    id character varying(100) NOT NULL
);


--
-- TOC entry 202 (class 1259 OID 16463)
-- Name: bids; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bids (
    id character(10) NOT NULL,
    token_name character varying(50) NOT NULL,
    current_bidder_address character varying(100) NOT NULL,
    current_bid_amount numeric NOT NULL,
    new_bidder_address character varying(100) NOT NULL,
    new_bid_amount numeric NOT NULL,
    tx_hash character varying(100) NOT NULL,
    created_time timestamp without time zone NOT NULL,
    auction_id character varying(100) NOT NULL
);


--
-- TOC entry 203 (class 1259 OID 16476)
-- Name: icon_blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.icon_blocks (
    block_hash character varying(100) NOT NULL,
    block_height bigint NOT NULL,
    block_data text NOT NULL,
    created_time timestamp without time zone NOT NULL
);


--
-- TOC entry 207 (class 1259 OID 16570)
-- Name: minted_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.minted_tokens (
    id character varying(100) NOT NULL,
    network_id character varying(100),
    token_name character varying(100),
    token_value numeric,
    total_token_amount numeric NOT NULL,
    block_time bigint,
    tx_hash character varying(100),
    block_hash character varying(100),
    block_height bigint,
    create_at timestamp without time zone NOT NULL
);

CREATE TABLE public.burned_tokens (
    id character varying(100) NOT NULL,
    network_id character varying(100),
    token_name character varying(100),
    token_value numeric,
    total_token_amount numeric NOT NULL,
    block_time bigint,
    tx_hash character varying(100),
    block_hash character varying(100),
    block_height bigint,
    create_at timestamp without time zone NOT NULL
);

--
-- TOC entry 208 (class 1259 OID 16582)
-- Name: moonbeam_blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moonbeam_blocks (
    block_hash character varying(100) NOT NULL,
    block_height bigint NOT NULL,
    block_data text NOT NULL,
    created_time timestamp without time zone NOT NULL
);


--
-- TOC entry 206 (class 1259 OID 16535)
-- Name: networks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.networks (
    id character varying(100) NOT NULL,
    name character varying(4000) NOT NULL,
    path_logo character varying(100),
    url character varying(100),
    mint_fee numeric,
    burn_fee numeric,
    create_at timestamp without time zone NOT NULL,
    update_at timestamp without time zone NOT NULL
);


--
-- TOC entry 204 (class 1259 OID 16499)
-- Name: relay_candidates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.relay_candidates (
    id character varying(100) NOT NULL,
    rank numeric NOT NULL,
    name character varying(50) NOT NULL,
    bonded_icx numeric NOT NULL,
    registered_time timestamp without time zone NOT NULL,
    unregistered_time timestamp without time zone,
    created_time timestamp without time zone NOT NULL,
    updated_time timestamp without time zone
);


--
-- TOC entry 204 (class 1259 OID 16499)
-- Name: relays; Type: TABLE; Schema: public; Owner: -
--

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

--
-- TOC entry 209 (class 1259 OID 16666)
-- Name: relay_rewards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relay_rewards (
    id character varying(100) NOT NULL,
    relay_id character varying(100) NOT NULL,
    reward_value numeric NOT NULL,
    updated_time timestamp without time zone
    created_time timestamp without time zone NOT NULL,
);

CREATE TABLE IF NOT EXISTS public.transactions
(
    id character varying(37) COLLATE pg_catalog."default" NOT NULL,
    serial_number character varying(50) COLLATE pg_catalog."default" NOT NULL,
    token_name character varying(50) COLLATE pg_catalog."default",
    value numeric,
    to_address character varying(100) COLLATE pg_catalog."default",
    from_address character varying(100) COLLATE pg_catalog."default",
    block_height integer,
    block_height_end integer,
    tx_hash character varying(100) COLLATE pg_catalog."default",
    tx_hash_end character varying(100) COLLATE pg_catalog."default",
    create_at timestamp without time zone,
    update_at timestamp without time zone,
    network_id character varying(20) COLLATE pg_catalog."default",
    block_time bigint,
    btp_fee numeric,
    network_fee numeric,
    status integer DEFAULT 0,
    total_volume numeric NOT NULL DEFAULT 0,
    tx_error character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT transactions_pkey PRIMARY KEY (id)
)

--
-- TOC entry 205 (class 1259 OID 16527)
-- Name: transfer_fees; Type: TABLE; Schema: public; Owner: -
--

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


CREATE TABLE IF NOT EXISTS public.tokens_info
(
    id character varying(100) NOT NULL,
    network_id character varying(100),
    token_name character varying(100),
    token_id character varying(200),
    tx_hash character varying(100),
    block_hash character varying(100),
    block_height bigint,
    create_at timestamp without time zone NOT NULL
);


CREATE TABLE public.relayers (
    id character varying(100) NOT NULL,
    description character varying(200) NOT NULL,
    address_relayer character varying(100) NOT NULL,
    address_bonded_to character varying(100) NOT NULL, 
    bonded_icx numeric NOT NULL,
    server_status character varying(20) NOT NULL,
    tx_hash character varying(100),
    block_hash character varying(100),
    block_height bigint,
    registered_time timestamp without time zone NOT NULL,
    unregistered_time timestamp without time zone,
    created_time timestamp without time zone NOT NULL,
    updated_time timestamp without time zone
);

--
-- TOC entry 2848 (class 2606 OID 16462)
-- Name: auctions auctions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auctions
    ADD CONSTRAINT auctions_pkey PRIMARY KEY (id);


--
-- TOC entry 2850 (class 2606 OID 16470)
-- Name: bids bids_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bids
    ADD CONSTRAINT bids_pkey PRIMARY KEY (id);


--
-- TOC entry 2852 (class 2606 OID 16483)
-- Name: icon_blocks icon_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.icon_blocks
    ADD CONSTRAINT icon_blocks_pkey PRIMARY KEY (block_hash);


--
-- TOC entry 2860 (class 2606 OID 16577)
-- Name: minted_tokens minted_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.minted_tokens
    ADD CONSTRAINT minted_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 2862 (class 2606 OID 16589)
-- Name: moonbeam_blocks moonbeam_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moonbeam_blocks
    ADD CONSTRAINT moonbeam_blocks_pkey PRIMARY KEY (block_hash);


--
-- TOC entry 2858 (class 2606 OID 16542)
-- Name: networks networks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.networks
    ADD CONSTRAINT networks_pkey PRIMARY KEY (id);


--
-- TOC entry 2854 (class 2606 OID 16506)
-- Name: relay_candidates relay_candidates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.relay_candidates
    ADD CONSTRAINT relay_candidates_pkey PRIMARY KEY (id);


--
-- TOC entry 2856 (class 2606 OID 16534)
-- Name: transfer_fees transfer_fees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transfer_fees
    ADD CONSTRAINT transfer_fees_pkey PRIMARY KEY (id);

--
-- TOC entry 2838 (class 2606 OID 16673)
-- Name: relay_rewards relay_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relay_rewards
    ADD CONSTRAINT relay_rewards_pkey PRIMARY KEY (id);

--
-- TOC entry 2839 (class 2606 OID 16674)
-- Name: relay_rewards relay_rewards_relay_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relay_rewards
    ADD CONSTRAINT relay_rewards_relay_id_fkey FOREIGN KEY (relay_id) REFERENCES public.relay_candidates(id);

-- Completed on 2021-07-08 06:56:41 UTC

--
-- PostgreSQL database dump complete
--

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
