CREATE TABLE map_locations(
location_id	INT IDENTITY(1,1)	NOT NULL
,location_name	VARCHAR(50)	NULL
,map_area	GEOMETRY(2147483647)	NULL)