CREATE TABLE Transactions (
   Id char varying(37) PRIMARY KEY,
   Serial_Number char varying(200) UNIQUE NOT NULL,
   Token_Name char varying(300),
   Value numeric(100,5),
   Block_Time bigint,
   Network_Id bigint,
   To_Address char varying(300),
   From_Address char varying(300),
   Block_Height integer,
   Block_Hash char varying(300),
   TX_Hash char varying(300),
   BTP_Fee numeric(100,100),
   Network_fee numeric(100,100),
   Status integer,
   Create_At integer,
   Update_At integer,
   Delete_At integer
);

ALTER TABLE public.transactions
ADD nid bigint,
ADD block_time bigint;

ALTER TABLE public.transactions
ADD BTP_Fee bigint,
ADD Network_Fee bigint;

ALTER TABLE public.transactions
RENAME COLUMN nid TO network_id;

ALTER TABLE public.transactions
ALTER COLUMN btp_fee TYPE numeric(100,100),
ALTER COLUMN network_fee TYPE numeric(100,100);

drop table Transactions
TRUNCATE table Transactions