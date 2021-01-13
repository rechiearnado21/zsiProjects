CREATE TABLE zAuthorizations(
auth_key	NVARCHAR(200)	NOT NULL
,user_id	INT	NULL
,serial_id	VARCHAR(100)	NULL
,log_datetime	DATETIME	NULL
,otp	VARCHAR(50)	NULL
,is_active	CHAR(1)	NULL)