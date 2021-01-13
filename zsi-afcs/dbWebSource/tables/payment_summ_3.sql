CREATE TABLE payment_summ_3(
payment_summ_id	INT IDENTITY(1,1)	NOT NULL
,payment_date	DATETIME	NULL
,vehicle_id	INT	NULL
,driver_id	INT	NULL
,pao_id	INT	NULL
,qr_amt	DECIMAL(20)	NULL
,pos_cash_amt	DECIMAL(20)	NULL
,actual_cash_amt	DECIMAL(20)	NULL
,total_collection_amt	DECIMAL(20)	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)