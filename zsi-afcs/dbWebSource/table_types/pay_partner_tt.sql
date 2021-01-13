CREATE TYPE pay_partner_tt AS TABLE(
pay_partner_id	INT	NULL
,is_edited	CHAR(1)	NULL
,partner_name	NVARCHAR(100)	NULL
,client_id	VARCHAR(100)	NULL
,client_secret	VARCHAR(100)	NULL
,merchant	VARCHAR(100)	NULL)