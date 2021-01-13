CREATE TABLE client_loads(
client_load_id	INT IDENTITY(1,1)	NOT NULL
,client_id	INT	NULL
,load_date	DATETIME	NULL
,load_amount	DECIMAL(12)	NULL
,ref_no	NVARCHAR(40)	NULL
,loaded_by	INT	NULL
,transfer_type_id	INT	NULL
,transfer_ref_no	NVARCHAR(40)	NULL)