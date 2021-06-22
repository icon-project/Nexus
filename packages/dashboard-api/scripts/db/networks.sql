CREATE TABLE public.networks (
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