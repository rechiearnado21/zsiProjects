CREATE PROCEDURE [dbo].[loading_branches_upd]
(
    @tt    loading_branches_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
			 company_id			= b.company_id	 
			,hash_key			= b.hash_key
			,store_code			= b.store_code
			,load_balance	    = b.load_balance 
			,is_active			= b.is_active		
	   	    ,updated_by			= @user_id
			,updated_date		= DATEADD(HOUR, 8, GETUTCDATE())
       FROM dbo.loading_branches a INNER JOIN @tt b
	     ON a.loading_branch_id = b.loading_branch_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO loading_branches(
         company_id 
		,hash_key
		,store_code
		,load_balance 
		,is_active
		,created_by
		,created_date
    )
	SELECT 
		 company_id 
		,newid()
		,store_code
		,cast(load_balance as nvarchar) 
		,is_active	
	    ,@user_id
	    ,DATEADD(HOUR, 8, GETUTCDATE())
	FROM @tt 
	WHERE loading_branch_id IS NULL
	AND ISNULL(company_id,'') <>''
	AND ISNULL(store_code,'') <>''