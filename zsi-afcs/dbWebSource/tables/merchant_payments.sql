CREATE TABLE merchant_payments(
merchant_payment_id	INT IDENTITY(1,1)	NOT NULL
,merchant_payment_date	DATETIME	NOT NULL
,client_id	INT	NOT NULL
,qr_id	INT	NOT NULL
,payment_ref_no	NVARCHAR(100)	NULL
,post_id	INT	NULL
,remit_id	INT	NULL
,payment_amount	DECIMAL(12)	NOT NULL
,consumer_id	INT	NULL)