CREATE TABLE client_routes(
client_route_id	INT IDENTITY(1,1)	NOT NULL
,client_id	INT	NULL
,route_id	INT	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)