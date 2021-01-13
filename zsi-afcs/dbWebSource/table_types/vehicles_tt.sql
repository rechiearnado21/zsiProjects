CREATE TYPE vehicles_tt AS TABLE(
vehicle_id	INT	NULL
,is_edited	CHAR(1)	NULL
,vehicle_plate_no	VARCHAR(50)	NULL
,route_id	INT	NULL
,vehicle_type_id	INT	NULL
,is_active	CHAR(1)	NULL
,odometer_reading	INT	NULL)