CREATE TABLE driver_pao_assignment(
driver_pao_assignment_id	INT IDENTITY(1,1)	NOT NULL
,client_id	INT	NULL
,assignment_date	DATE	NULL
,vehicle_id	INT	NULL
,driver_id	INT	NULL
,pao_id	INT	NULL
,shift_id	INT	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)