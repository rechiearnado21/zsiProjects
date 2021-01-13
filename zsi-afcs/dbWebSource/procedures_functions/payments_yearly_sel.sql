CREATE procedure [dbo].[payments_yearly_sel]
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
   DECLARE @payments_summ_tbl nvarchar(50);

  SET @payments_summ_tbl = CONCAT('zsi_afcs_client_data.dbo.payments_summ_',@client_id);
  SET @end_year = YEAR(DATEADD(HOUR,8,GETUTCDATE()));
  SET @start_year = @end_year-@no_year;


  SET @stmt = CONCAT('SELECT YEAR(payment_date) pay_year, SUM(total_collection_amt) total_fare FROM ',@payments_summ_tbl, 
                     ' WHERE  YEAR(payment_date) BETWEEN ',@start_year, ' AND ', @end_year,
					 ' GROUP BY YEAR(payment_date)'); 

print (@stmt)
EXEC(@stmt);

END

-- [payments_yearly_sel] @client_id=''