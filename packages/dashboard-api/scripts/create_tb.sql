-- DROP DATABASE IF EXISTS "CTB";
-- CREATE DATABASE "CTB";

CREATE TABLE transfer_fees (
  id varchar(10) NOT NULL,
  name varchar(128) NOT NULL,
  value bigint,
  receive_at timestamp,
  PRIMARY KEY (id)
);