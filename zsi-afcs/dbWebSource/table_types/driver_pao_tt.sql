CREATE TYPE driver_pao_tt AS TABLE(
id	INT	NULL
,is_edited	CHAR(1)	NULL
,client_id	INT	NULL
,employee_no	NVARCHAR(100)	NULL
,last_name	NVARCHAR(100)	NULL
,first_name	NVARCHAR(100)	NULL
,middle_name	NVARCHAR(100)	NULL
,name_suffix	NVARCHAR(100)	NULL
,gender	CHAR(1)	NULL
,contact_phone_no	NVARCHAR(100)	NULL
,driver_academy_no	NVARCHAR(100)	NULL
,driver_license_no	NVARCHAR(100)	NULL
,driver_license_exp_date	DATE	NULL
,is_driver	CHAR(1)	NULL
,is_pao	CHAR(1)	NULL
,is_active	VARCHAR(1)	NULL)