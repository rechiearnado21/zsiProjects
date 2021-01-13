CREATE TYPE actual_payments_tt AS TABLE(
payment_summ_id	INT	NULL
,payment_date	DATETIME	NULL
,is_edited	CHAR(1)	NULL
,vehicle_plate_no	NVARCHAR(200)	NULL
,vehicle_id	INT	NULL
,driver_name	NVARCHAR(200)	NULL
,driver_id	INT	NULL
,pao_name	NVARCHAR(200)	NULL
,pao_id	INT	NULL
,qr_amt	DECIMAL(20)	NULL
,pos_cash_amt	DECIMAL(20)	NULL
,shortage_amt	DECIMAL(20)	NULL
,excess_amt	DECIMAL(20)	NULL
,total_collection_amt	DECIMAL(20)	NULL)