CREATE procedure [dbo].[payment_daily_sel]
( 
  @client_id int 
 ,@month   int
 ,@year    int
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
  SET @start_year = @end_year-@year;


  SET @stmt = CONCAT('SELECT DAY(payment_date) pay_day,  SUM(total_paid_amount) total_fare FROM ',@payments_tbl, 
                     ' WHERE  YEAR(payment_date)=',@year,' AND MONTH(payment_date)=',@month,
					 ' GROUP BY DAY(payment_date)'); 

EXEC(@stmt);

END

--[dbo].[payment_monthly_sel] @client_id=1, @year=2020