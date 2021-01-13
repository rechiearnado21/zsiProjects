CREATE TABLE cancelled_fares(
cancelled_fare_id	INT IDENTITY(1,1)	NOT NULL
,payment_id	INT	NOT NULL
,reason	NVARCHAR(200)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL)