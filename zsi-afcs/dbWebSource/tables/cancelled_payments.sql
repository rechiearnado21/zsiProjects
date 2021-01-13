CREATE TABLE cancelled_payments(
cancelled_payment_id	INT IDENTITY(1,1)	NOT NULL
,generated_qr_id	INT	NOT NULL
,amount	DECIMAL(14)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL)