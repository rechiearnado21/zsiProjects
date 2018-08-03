CREATE TYPE employees_tt AS TABLE(
user_id	INT	NULL
,is_edited	CHAR(1)	NULL
,id_no	NVARCHAR(20)	NULL
,last_name	NVARCHAR(200)	NULL
,first_name	NVARCHAR(200)	NULL
,middle_name	NVARCHAR(200)	NULL
,name_suffix	NVARCHAR(20)	NULL
,civil_status	CHAR(1)	NULL
,contact_nos	VARCHAR(100)	NULL
,email_add	NVARCHAR(600)	NULL
,gender	CHAR(1)	NULL
,organization_id	INT	NULL
,warehouse_id	INT	NULL
,rank_id	INT	NULL
,position_id	INT	NULL
,is_pilot	CHAR(1)	NULL
,is_active	CHAR(1)	NULL)