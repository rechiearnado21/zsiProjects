CREATE procedure [dbo].[payment_sel]
( 
  
 @user_id int = null
)
AS
BEGIN
  SELECT * FROM dbo.payments WHERE 1=1;
END

