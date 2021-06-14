CREATE TABLE Networks (
   Id char varying(30) PRIMARY KEY,
   name char varying(200) UNIQUE NOT NULL,
   Logo char varying(300),
   Create_At TIMESTAMP,
   Update_At TIMESTAMP,
   Delete_At TIMESTAMP
);

CREATE TABLE public.networks_connected_icon (
    id bigint NOT NULL,
    nid bigint,
    logo character varying(300),
    network_name character varying(64),
    volume_24h bigint,
    volume_all_time bigint,
    create_at bigint,
    update_at bigint,
    delete_at bigint
);

SELECT SUM(value) FROM Transactions WHERE Confirmed = true