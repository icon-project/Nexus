CREATE TABLE Networks (
   Id char varying(30) PRIMARY KEY,
   name char varying(200) UNIQUE NOT NULL,
   Logo char varying(300),
   Create_At TIMESTAMP,
   Update_At TIMESTAMP,
   Delete_At TIMESTAMP
);