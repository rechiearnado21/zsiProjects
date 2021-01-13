CREATE TABLE menus(
menu_id	INT IDENTITY(1,1)	NOT NULL
,pmenu_id	INT	NULL
,menu_name	NVARCHAR(400)	NOT NULL
,seq_no	INT	NULL
,page_id	INT	NULL
,parameters	VARCHAR(50)	NULL
,is_default	VARCHAR(1)	NULL
,icon	VARCHAR(50)	NULL
,is_dev	VARCHAR(1)	NULL
,is_admin	VARCHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)