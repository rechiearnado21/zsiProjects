CREATE TYPE route_details_tt AS TABLE(
route_detail_id	INT	NULL
,is_edited	CHAR(1)	NULL
,route_id	INT	NULL
,route_no	INT	NULL
,location	VARCHAR(50)	NULL
,distance_km	DECIMAL(20)	NULL
,seq_no	INT	NULL
,map_area	GEOMETRY(0)	NULL)