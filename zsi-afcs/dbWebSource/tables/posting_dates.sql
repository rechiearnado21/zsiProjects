CREATE TABLE posting_dates(
id	INT IDENTITY(1,1)	NOT NULL
,posted_date	DATETIME	NULL
,client_id	INT	NULL
,bank_transfer_ref	NVARCHAR(40)	NULL
,posted_amount	DECIMAL(20)	NULL
,created_by	INT	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)