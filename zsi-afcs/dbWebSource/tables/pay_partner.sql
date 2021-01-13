CREATE TABLE pay_partner(
pay_partner_id	INT IDENTITY(1,1)	NOT NULL
,partner_name	VARCHAR(50)	NOT NULL
,client_id	VARCHAR(100)	NULL
,client_secret	VARCHAR(100)	NULL
,merchant	VARCHAR(100)	NULL
,pri_key	VARBINARY(50)	NULL
,pub_key	VARBINARY(50)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)