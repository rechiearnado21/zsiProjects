CREATE TABLE pay_partner_apis(
api_id	INT IDENTITY(1,1)	NOT NULL
,pay_partner_id	INT	NOT NULL
,api_name	VARCHAR(200)	NOT NULL
,api_url	TEXT(2147483647)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)