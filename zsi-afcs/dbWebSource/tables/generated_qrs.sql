CREATE TABLE generated_qrs(
id	INT IDENTITY(1,1)	NOT NULL
,hash_key	NVARCHAR(200)	NOT NULL
,hash_key2	NVARCHAR(200)	NOT NULL
,is_taken	CHAR(1)	NOT NULL
,is_active	CHAR(1)	NOT NULL
,is_loaded	NCHAR(2)	NULL
,balance_amt	DECIMAL(20)	NOT NULL
,consumer_id	INT	NULL
,ref_trans	NVARCHAR(100)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,expiry_date	DATE	NULL
,is_prepaid	CHAR(1)	NULL
,batch_no	INT	NULL
,denomination	INT	NULL
,client_id	INT	NULL)