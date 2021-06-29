-- Table: public.minted

-- DROP TABLE public.minted;

CREATE TABLE IF NOT EXISTS public.minted (
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