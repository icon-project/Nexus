
CREATE TABLE public.transactions (
    id integer NOT NULL,
    nid bigint,
    token_id bigint,
    token_name character varying,
    value bigint,
    "timestamp" bigint
);