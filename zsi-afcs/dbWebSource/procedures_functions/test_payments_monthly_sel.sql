
CREATE procedure [dbo].[test_payments_monthly_sel]
( 
  @client_id int  
 ,@no_year  int=5
 ,@user_id int=NULL

)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)='';
  DECLARE @start_year INT;
  DECLARE @end_year INT;
  DECLARE @payments_tbl nvarchar(20);
  SET @payments_tbl = CONCAT('dbo.payments_',@client_id);
  SET @end_year = YEAR(DATEADD(HOUR,8,GETUTCDATE()));
  --SET @start_year = @end_year-@year;
  SET @start_year = @end_year-@no_year;


  SET @stmt = CONCAT('SELECT MONTH(payment_date) pay,  SUM(total_paid_amount) total_fare FROM ',@payments_tbl, 
                     --' WHERE YEAR(payment_date)=',@no_year,
					 ' GROUP BY MONTH(payment_date)'); 

EXEC(@stmt);

END

--[dbo].[test_payments_monthly_sel] @client_id=1
