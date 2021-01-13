CREATE procedure [dbo].[payments_monthly_sel]
( 
  @client_id int 
 ,@year    int
 ,@user_id int=NULL

)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)=''; 
   DECLARE @payments_summ_tbl nvarchar(50);
  SET @payments_summ_tbl = CONCAT('zsi_afcs_client_data.dbo.payments_summ_',@client_id);

  SET @stmt = CONCAT('SELECT MONTH(payment_date) pay_month,  SUM(total_collection_amt) total_fare FROM ',@payments_summ_tbl, 
                     ' WHERE  YEAR(payment_date)=',@year,
					 ' GROUP BY MONTH(payment_date)'); 


EXEC(@stmt);

END


--[dbo].[payments_monthly_sel] @client_id=5 ,@year='2020'