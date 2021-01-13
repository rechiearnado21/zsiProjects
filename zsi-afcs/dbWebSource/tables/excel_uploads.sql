CREATE TABLE excel_uploads(
id	INT IDENTITY(1,1)	NOT NULL
,temp_table	VARCHAR(50)	NULL
,excel_column_range	VARCHAR(100)	NULL
,load_name	VARCHAR(50)	NULL
,seq_no	INT	NULL
,redirect_page	NVARCHAR(100)	NULL
,insert_proc	NVARCHAR(200)	NULL)