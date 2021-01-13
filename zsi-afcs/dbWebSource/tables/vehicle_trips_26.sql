CREATE TABLE vehicle_trips_26(
trip_id	INT IDENTITY(1,1)	NOT NULL
,trip_no	INT	NULL
,vehicle_id	INT	NULL
,driver_id	INT	NULL
,pao_id	INT	NULL
,start_date	DATE	NULL
,end_date	DATE	NULL
,start_odo	INT	NULL
,end_odo	INT	NULL
,start_by	INT	NULL
,end_by	INT	NULL
,no_kms	INT	NULL
,total_collection_amount	DECIMAL(20)	NULL
,is_open	CHAR(1)	NULL
,trip_hash_key	NVARCHAR(200)	NULL)