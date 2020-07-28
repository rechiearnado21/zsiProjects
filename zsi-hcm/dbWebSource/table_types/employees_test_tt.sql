CREATE TYPE employees_test_tt AS TABLE(
id	INT	NULL
,is_edited	CHAR(1)	NULL
,employee_id	INT	NULL
,last_name	NVARCHAR(100)	NULL
,first_name	NVARCHAR(100)	NULL
,middle_name	NVARCHAR(100)	NULL
,name_suffix	NVARCHAR(100)	NULL
,gender	CHAR(1)	NULL
,civil_status_code	CHAR(1)	NULL
,empl_type_code	CHAR(1)	NULL
,basic_pay	DECIMAL(20)	NULL
,pay_type_code	CHAR(1)	NULL
,sss_no	NVARCHAR(100)	NULL
,tin	NVARCHAR(100)	NULL
,philhealth_no	NVARCHAR(100)	NULL
,hmdf_no	NVARCHAR(100)	NULL
,account_no	NVARCHAR(100)	NULL
,is_active	VARCHAR(1)	NULL
,inactive_type_code	CHAR(1)	NULL
,inactive_date	DATE	NULL)