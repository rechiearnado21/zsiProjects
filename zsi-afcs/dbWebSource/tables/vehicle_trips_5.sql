CREATE TABLE vehicle_trips_5(
trip_id	INT IDENTITY(1,1)	NOT NULL
,trip_no	INT	NULL
,vehicle_id	INT	NULL
,driver_id	INT	NULL
,pao_id	INT	NULL
,route_id	INT	NULL
,route_no	INT	NULL
,start_date	DATETIME	NULL
,end_date	DATETIME	NULL
,start_odo	INT	NULL
,end_odo	INT	NULL
,start_by	INT	NULL
,end_by	INT	NULL
,no_kms	INT	NULL
,total_collection_amt	DECIMAL(20)	NULL
,is_open	CHAR(1)	NULL
,trip_hash_key	NVARCHAR(200)	NULL)