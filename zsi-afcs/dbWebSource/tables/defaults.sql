CREATE TABLE defaults(
default_id	INT IDENTITY(1,1)	NOT NULL
,hash_key	NVARCHAR(100)	NOT NULL
,default_name	NVARCHAR(100)	NOT NULL
,default_description	NTEXT(2147483646)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)