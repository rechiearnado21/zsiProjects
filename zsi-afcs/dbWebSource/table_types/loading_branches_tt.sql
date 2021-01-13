CREATE TYPE loading_branches_tt AS TABLE(
loading_branch_id	INT	NULL
,is_edited	CHAR(1)	NULL
,company_id	INT	NULL
,hash_key	NVARCHAR(100)	NULL
,store_code	NCHAR(100)	NULL
,load_balance	DECIMAL(12)	NULL
,is_active	CHAR(1)	NULL)