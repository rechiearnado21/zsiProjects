CREATE TABLE routes_ref(
route_id	INT IDENTITY(1,1)	NOT NULL
,route_code	NVARCHAR(40)	NULL
,route_desc	NVARCHAR(400)	NULL
,route_hash_key	NTEXT(2147483646)	NULL)