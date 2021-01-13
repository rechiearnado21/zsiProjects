CREATE TABLE roles(
role_id	INT IDENTITY(1,1)	NOT NULL
,role_name	NVARCHAR(80)	NOT NULL
,program_level	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)