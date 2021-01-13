CREATE TABLE fare_matrix(
fare_id	INT IDENTITY(1,1)	NOT NULL
,base_fare	DECIMAL(20)	NULL
,base_kms	DECIMAL(20)	NULL
,succeeding_km_fare	DECIMAL(20)	NULL
,vehicle_type	NVARCHAR(100)	NULL
,transport_group_id	INT	NULL
,with_pao	CHAR(1)	NULL)