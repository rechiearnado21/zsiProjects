CREATE TABLE item_types(
item_type_id	INT IDENTITY(1,1)	NOT NULL
,item_cat_id	INT	NOT NULL
,item_type_code	NVARCHAR(30)	NOT NULL
,item_type_name	NVARCHAR(100)	NOT NULL
,parent_item_type_id	INT	NULL
,is_active	NCHAR(2)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)