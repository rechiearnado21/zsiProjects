CREATE TYPE drivers_pao_assignment_tt AS TABLE(
drivers_pao_assignment_id	INT	NULL
,is_edited	CHAR(1)	NULL
,client_id	INT	NULL
,vehicle_id	INT	NULL
,assignment_date	DATE	NULL
,driver_id	INT	NULL
,pao_id	INT	NULL
,shift_id	INT	NULL)