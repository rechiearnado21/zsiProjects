CREATE TABLE payments_28(
payment_id	INT	NOT NULL
,payment_date	DATETIME	NOT NULL
,device_id	INT	NULL
,vehicle_id	INT	NULL
,pao_id	INT	NULL
,driver_id	INT	NULL
,inspector_id	INT	NULL
,route_id	INT	NULL
,from_location	NVARCHAR(200)	NULL
,to_location	NVARCHAR(200)	NULL
,no_klm	DECIMAL(14)	NULL
,no_reg	INT	NULL
,no_stu	INT	NULL
,no_sc	INT	NULL
,no_pwd	INT	NULL
,reg_amount	DECIMAL(14)	NULL
,stu_amount	DECIMAL(14)	NULL
,sc_amount	DECIMAL(14)	NULL
,pwd_amount	DECIMAL(14)	NULL
,total_paid_amount	DECIMAL(14)	NULL
,qr_id	INT	NULL
,qr_ref_no	NVARCHAR(100)	NULL
,post_id	INT	NULL
,remit_id	INT	NULL
,payment_key	NVARCHAR(100)	NULL
,prev_qr_id	INT	NULL
,is_cancelled	NCHAR(2)	NOT NULL
,trip_id	INT	NULL
,consumer_id	INT	NULL
,base_fare	DECIMAL(12)	NULL
,client_id	INT	NULL
,start_km	INT	NULL
,end_km	INT	NULL
,is_client_qr	CHAR(1)	NULL
,is_open	CHAR(1)	NULL)