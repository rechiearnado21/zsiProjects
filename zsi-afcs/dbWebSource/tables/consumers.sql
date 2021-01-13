CREATE TABLE consumers(
consumer_id	INT IDENTITY(1,1)	NOT NULL
,hash_key	NTEXT(2147483646)	NOT NULL
,first_name	NVARCHAR(200)	NOT NULL
,middle_name	NVARCHAR(200)	NULL
,last_name	NVARCHAR(200)	NOT NULL
,name_suffix	NVARCHAR(10)	NULL
,gender	CHAR(1)	NULL
,address	NVARCHAR(600)	NULL
,city_id	INT	NULL
,state_id	INT	NULL
,country_id	INT	NULL
,email	NVARCHAR(600)	NULL
,password	VARBINARY(50)	NULL
,image_filename3	NTEXT(2147483646)	NULL
,image_filename	IMAGE(2147483647)	NULL
,is_active	CHAR(1)	NOT NULL
,activation_code	NVARCHAR(12)	NULL
,birthdate	DATE	NULL
,mobile_no	NVARCHAR(40)	NULL
,landline_no	NVARCHAR(40)	NULL
,tin	NVARCHAR(40)	NULL
,transfer_type_id	INT	NULL
,bank_id	INT	NULL
,transfer_no	NVARCHAR(40)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,credit_amount	DECIMAL(12)	NULL
,otp	NVARCHAR(12)	NULL
,otp_expiry_datetime	DATETIME	NULL
,qr_id	INT	NULL
,activation_code_expiry	DATETIME	NULL
,barangay_id	INT	NULL)