CREATE TYPE menus_tt AS TABLE(
menu_id	INT	NULL
,is_edited	CHAR(1)	NULL
,pmenu_id	INT	NULL
,menu_name	NVARCHAR(400)	NULL
,page_id	INT	NULL
,parameters	NVARCHAR(400)	NULL
,seq_no	INT	NULL
,icon	NVARCHAR(400)	NULL
,is_default	NVARCHAR(2)	NULL
,is_admin	NVARCHAR(2)	NULL
,is_dev	NVARCHAR(2)	NULL)