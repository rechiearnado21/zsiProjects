CREATE TABLE bank_transfers(
bank_transfer_id	INT IDENTITY(1,1)	NOT NULL
,bank_transfer_date	DATE	NULL
,bank_id	INT	NULL
,bank_ref_no	NVARCHAR(100)	NULL
,company_code	NVARCHAR(100)	NULL
,transferred_amount	DECIMAL(20)	NULL
,posted_date	DATETIME	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)