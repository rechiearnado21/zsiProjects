CREATE TABLE discount_ref(
discount_id	INT IDENTITY(1,1)	NOT NULL
,discount_code	NVARCHAR(20)	NULL
,discount_desc	NVARCHAR(100)	NULL
,discount_pct	DECIMAL(20)	NULL)