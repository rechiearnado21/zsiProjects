CREATE TABLE banks(
bank_id	INT IDENTITY(1,1)	NOT NULL
,bank_code	NVARCHAR(100)	NULL
,bank_name	NVARCHAR(100)	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)