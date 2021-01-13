CREATE TABLE sms_notifications(
sms_notification_id	INT IDENTITY(1,1)	NOT NULL
,app_name	NVARCHAR(100)	NOT NULL
,mobile_no	NVARCHAR(40)	NOT NULL
,message	NVARCHAR(600)	NOT NULL
,is_processed	NCHAR(2)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)