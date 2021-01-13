CREATE TABLE devices(
device_id	INT IDENTITY(1,1)	NOT NULL
,hash_key	NVARCHAR(200)	NOT NULL
,serial_no	NVARCHAR(100)	NULL
,is_active	CHAR(1)	NULL
,consumer_id	INT	NULL
,company_id	INT	NOT NULL
,mobile_no	NVARCHAR(40)	NULL
,crm_device_id	INT	NULL
,sim_no	NVARCHAR(100)	NULL
,load_date	DATETIME	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,driver_id	INT	NULL
,pao_id	INT	NULL)