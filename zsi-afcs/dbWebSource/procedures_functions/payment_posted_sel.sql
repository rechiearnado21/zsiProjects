CREATE procedure [dbo].[payment_posted_sel]
( 
  @client_id    int
 ,@post_id		int 
 ,@vehicle_id	int
 ,@user_id		int = null
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)='';
  SET @stmt = 'SELECT * FROM dbo.payments_transactions_posted_v WHERE client_id = ' + cast(@client_id as varchar(20))
  
  IF ISNULL(@post_id,0) <> 0
     SET @stmt= @stmt + ' AND post_id = ' + CAST(@post_id AS VARCHAR(20))

  IF ISNULL(@vehicle_id,0) <> 0
     SET @stmt= @stmt + ' AND vehicle_id = ' + CAST(@vehicle_id AS VARCHAR(20))	 

  EXEC(@stmt);
END



