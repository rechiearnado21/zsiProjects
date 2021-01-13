CREATE procedure [dbo].[posted_dates_sel]
( 
 @user_id int = null
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)='';
  DECLARE @client_id int 
  SELECT @client_id=company_id from dbo.users_v where user_id=@user_id;
  SELECT id, posted_date, format(id,'000000') post_no ,posted_amount, client_id FROM dbo.posting_dates where client_id = @client_id

END


