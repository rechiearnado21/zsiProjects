

CREATE PROCEDURE [dbo].[loading_branch_deposits_upd]
(
    @tt    loading_branch_deposits_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET  loading_branch_id		= b.loading_branch_id
			,deposit_date		= b.deposit_date
			,deposit_ref_no		= b.deposit_ref_no
			,deposit_amount		= b.deposit_amount 
			
     FROM dbo.loading_branch_deposits a INNER JOIN @tt b
        ON a.loading_branch_deposit_id = b.loading_branch_deposit_id 
       WHERE (
			isnull(b.is_edited,'')  <> ''
			and b.loading_branch_id IS NOT NULL
	        and b.deposit_date IS NOT NULL
	        and b.deposit_ref_no IS NOT NULL
			and b.deposit_amount IS NOT NULL
		
	   )

-- Insert Process

    INSERT INTO loading_branch_deposits (
         loading_branch_id	
		,deposit_date
		,deposit_ref_no
		,deposit_amount
		,created_by
		,created_date
		
        )
    SELECT 
          loading_branch_id	
		,deposit_date
		,deposit_ref_no
		,deposit_amount		
	    ,@user_id
	    ,DATEADD(HOUR, 8, GETUTCDATE())
	   
    FROM @tt
    WHERE loading_branch_id is not null
	and deposit_date is not null  
END



