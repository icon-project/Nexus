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

SELECT SUM(value) FROM Transactions WHERE Confirmed = true