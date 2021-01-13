CREATE TABLE loading(
loading_id	INT IDENTITY(1,1)	NOT NULL
,load_date	DATETIME	NOT NULL
,qr_id	INT	NULL
,load_amount	DECIMAL(20)	NOT NULL
,device_id	INT	NULL
,load_by	INT	NULL
,remit_id	INT	NULL
,prev_qr_id	INT	NULL
,loading_charge	DECIMAL(10)	NULL
,loading_branch_id	INT	NULL
,is_top_up	CHAR(1)	NULL
,ref_no	NVARCHAR(60)	NULL
,consumer_id	INT	NULL)