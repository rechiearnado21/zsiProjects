CREATE TABLE load_deposits(
load_deposit_id	INT IDENTITY(1,1)	NOT NULL
,load_deposit_date	DATE	NULL
,bank_code	INT	NULL
,bank_ref_no	NVARCHAR(100)	NULL
,deposited_amount	NVARCHAR(100)	NULL
,posted_date	DATETIME	NULL
,confirmed_date	DATE	NULL
,confirmation_no	NVARCHAR(100)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)