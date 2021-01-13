CREATE TABLE ztokens(
token_id	INT IDENTITY(1,1)	NOT NULL
,user_id	INT	NOT NULL
,cust_id	INT	NOT NULL
,expiry_interval	INT	NULL
,created_date	DATETIME	NOT NULL)