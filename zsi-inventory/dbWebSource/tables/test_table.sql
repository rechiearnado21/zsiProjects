CREATE TABLE test_table(
id	INT IDENTITY(1,1)	NOT NULL
,name	NVARCHAR(100)	NOT NULL
,age	DECIMAL(20)	NOT NULL
,salary	DECIMAL(20)	NOT NULL
,created_by	INT	NULL
,created_date	DATETIMEOFFSET	NULL
,updated_by	INT	NULL
,updated_date	DATETIMEOFFSET	NULL)