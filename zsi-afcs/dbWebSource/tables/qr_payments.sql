CREATE TABLE qr_payments(
qr_payment_id	INT IDENTITY(1,1)	NOT NULL
,device_id	INT	NULL
,vehicle_id	INT	NULL
,qr_id	INT	NULL
,payment_date_fr	DATETIME	NULL
,payment_date_to	DATETIME	NULL
,route_id_fr	INT	NULL
,route_id_to	INT	NULL
,route_km_fr	DECIMAL(12)	NULL
,route_km_to	DECIMAL(12)	NULL)