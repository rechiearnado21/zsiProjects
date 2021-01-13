CREATE TABLE loading_temp(
loading_temp_id	INT IDENTITY(1,1)	NOT NULL
,load_date	DATETIME	NOT NULL
,qr_id	INT	NOT NULL
,load_amount	DECIMAL(14)	NOT NULL
,load_by	INT	NOT NULL
,loading_branch_id	INT	NULL
,otp	NVARCHAR(20)	NOT NULL
,otp_expiry_date	DATETIME	NOT NULL
,is_processed	NCHAR(2)	NOT NULL)