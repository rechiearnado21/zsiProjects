CREATE TYPE excel_upload_tt AS TABLE(
id	INT	NULL
,temp_table	VARCHAR(50)	NULL
,excel_column_range	VARCHAR(50)	NULL
,load_name	VARCHAR(50)	NULL
,seq_no	INT	NULL
,redirect_page	NVARCHAR(100)	NULL)