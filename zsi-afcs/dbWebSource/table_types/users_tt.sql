CREATE TYPE users_tt AS TABLE(
user_id	INT	NULL
,is_edited	CHAR(1)	NULL
,client_id	INT	NULL
,logon	NVARCHAR(80)	NULL
,first_name	NVARCHAR(400)	NULL
,last_name	NVARCHAR(400)	NULL
,middle_name	NVARCHAR(400)	NULL
,name_suffix	NVARCHAR(40)	NULL
,role_id	INT	NULL
,is_admin	VARCHAR(1)	NULL
,is_active	VARCHAR(1)	NULL)