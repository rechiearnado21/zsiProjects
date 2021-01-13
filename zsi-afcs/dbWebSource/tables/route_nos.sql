CREATE TABLE route_nos(
route_no_id	INT IDENTITY(1,1)	NOT NULL
,route_id	INT	NOT NULL
,route_no	INT	NOT NULL
,route_name	NVARCHAR(400)	NOT NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)