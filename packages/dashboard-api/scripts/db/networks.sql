CREATE TABLE public.networks (
    name character varying(4000) NOT NULL,
    id character varying NOT NULL,
    path character varying(100),
    url character varying(100)
);


SELECT SUM(value) FROM Transactions WHERE Confirmed = true