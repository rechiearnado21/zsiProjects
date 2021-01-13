CREATE PROCEDURE [dbo].[bank_transfers_upd](
  @bank_transfer_id int = null
 ,@bank_transfer_date date
 ,@bank_id int 
 ,@bank_ref_no nvarchar(50) = null
 ,@company_code nvarchar(50) = null
 ,@transferred_amount decimal(18,2)
 ,@posted_date date=null
 ,@user_id int 
)
AS
BEGIN
SET NOCOUNT ON
IF ISNULL(@bank_transfer_id,0)=0
    INSERT INTO dbo.bank_transfers
	 (bank_transfer_date
	 ,bank_id
	 ,bank_ref_no
	 ,company_code
	 ,transferred_amount
	 ,posted_date
	 ,created_by
	 ,created_date
	 ) VALUES
	 (@bank_transfer_date
	 ,@bank_id
	 ,@bank_ref_no
	 ,@company_code
	 ,@transferred_amount
	 ,@posted_date
	 ,@user_id
	 ,DATEADD(HOUR, 8, GETUTCDATE())
	 ) 
ELSE
   UPDATE dbo.bank_transfers SET
			bank_transfer_date= @bank_transfer_date
		   ,bank_id			  = @bank_id
		   ,bank_ref_no		  = @bank_ref_no
		   ,company_code	  = @company_code
		   ,transferred_amount = @transferred_amount
		   ,posted_date		  = @posted_date
		   ,updated_by        = @user_id
		   ,updated_date      = DATEADD(HOUR, 8, GETUTCDATE());
END
