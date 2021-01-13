CREATE TYPE device_tt AS TABLE(
device_id	INT	NULL
,is_edited	CHAR(1)	NULL
,serial_no	NVARCHAR(100)	NULL
,mobile_no	NVARCHAR(40)	NULL
,load_date	NVARCHAR(40)	NULL
,is_active	CHAR(1)	NULL)