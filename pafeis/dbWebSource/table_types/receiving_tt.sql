CREATE TYPE receiving_tt AS TABLE(
receiving_id	INT	NULL
,receiving_no	INT	NULL
,doc_no	NVARCHAR(100)	NULL
,doc_date	DATETIME	NULL
,dealer_id	INT	NULL
,receiving_organization_id	INT	NULL
,transfer_organization_id	INT	NULL
,aircraft_id	INT	NULL
,received_by	INT	NULL
,received_date	DATETIME	NULL
,status_id	INT	NULL
,status_remarks	NVARCHAR(0)	NULL)