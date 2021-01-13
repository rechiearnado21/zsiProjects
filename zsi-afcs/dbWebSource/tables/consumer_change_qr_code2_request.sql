CREATE TABLE consumer_change_qr_code2_request(
consumer_change_qr_code2_request_id	INT IDENTITY(1,1)	NOT NULL
,consumer_id	INT	NOT NULL
,reason	NVARCHAR(600)	NOT NULL
,is_processed	NCHAR(2)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)