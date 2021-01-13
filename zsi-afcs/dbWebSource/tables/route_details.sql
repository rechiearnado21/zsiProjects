CREATE TABLE route_details(
route_detail_id	INT IDENTITY(1,1)	NOT NULL
,route_id	INT	NOT NULL
,route_no	INT	NOT NULL
,location	NVARCHAR(200)	NOT NULL
,distance_km	DECIMAL(22)	NOT NULL
,seq_no	INT	NOT NULL
,map_area	GEOMETRY(2147483647)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)