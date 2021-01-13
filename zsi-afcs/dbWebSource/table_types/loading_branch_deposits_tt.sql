CREATE TYPE loading_branch_deposits_tt AS TABLE(
loading_branch_deposit_id	INT	NULL
,is_edited	CHAR(1)	NULL
,loading_branch_id	INT	NULL
,deposit_date	DATE	NULL
,deposit_ref_no	NVARCHAR(100)	NULL
,deposit_amount	DECIMAL(12)	NULL)