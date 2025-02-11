CREATE TYPE drivers_tt AS TABLE(
user_id	INT	NULL
,client_id	INT	NULL
,emp_hash_key	NVARCHAR(1000)	NULL
,is_edited	CHAR(1)	NULL
,last_name	NVARCHAR(400)	NULL
,first_name	NVARCHAR(400)	NULL
,middle_name	NVARCHAR(100)	NULL
,name_suffix	NVARCHAR(100)	NULL
,driver_academy_no	NVARCHAR(100)	NULL
,driver_license_no	NVARCHAR(100)	NULL
,driver_license_exp_date	NVARCHAR(100)	NULL
,position_id	INT	NULL
,is_active	VARCHAR(1)	NULL)