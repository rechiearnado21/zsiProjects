CREATE procedure [dbo].[posted_banktransfers_sel]
( 
  @user_id int = null 
 ,@bank_transfer_id int = null

)
AS
BEGIN
SET NOCOUNT ON
  DECLARE @co_code nvarchar(20)=null
  DECLARE @stmt nvarchar(max)='';
  select @co_code = company_code FROM dbo.users where user_id=@user_id;
   
	 SET @stmt = 'SELECT * FROM dbo.bank_tranfers_posted_v  where company_code=''' + @co_code + ''''
	  
	 IF ISNULL(@bank_transfer_id,0) <> 0
			SET @stmt = @stmt + ' WHERE bank_transfer_id = ' + CAST(@bank_transfer_id AS VARCHAR(20));

	  EXEC(@stmt);
  
END;

--posted_banktransfers_sel @bank_transfer_id=2
