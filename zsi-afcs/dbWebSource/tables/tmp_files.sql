CREATE TABLE tmp_files(
tmp_file_id	INT IDENTITY(1,1)	NOT NULL
,user_id	INT	NOT NULL
,file_name	VARCHAR(50)	NULL
,file_content	IMAGE(2147483647)	NULL)