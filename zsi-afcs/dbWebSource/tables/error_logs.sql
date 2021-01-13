CREATE TABLE error_logs(
error_id	INT IDENTITY(1,1)	NOT NULL
,error_no	INT	NULL
,error_msg	TEXT(2147483647)	NOT NULL
,occurence	INT	NULL
,error_type	VARCHAR(1)	NULL
,page_url	TEXT(2147483647)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)