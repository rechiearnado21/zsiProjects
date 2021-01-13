CREATE procedure [dbo].[payment_history_summ_sel]
( 
  @client_id  int = null
 ,@vehicle_id int = null
 ,@pdate_from varchar(10)=null
 ,@pdate_to   varchar(10)=null
 ,@order_no   int = 0  
 ,@col_no	 INT = 8
 ,@user_id    int = null
)
AS
BEGIN
  SET NOCOUNT ON 
	DECLARE @stmt VARCHAR(MAX)   
	DECLARE @payments_summ_tbl nvarchar(50);
	DECLARE @orderby VARCHAR(100) = ' ASC';
    
	SET @payments_summ_tbl = CONCAT('zsi_afcs_client_data.dbo.payments_summ_',@client_id); 
  
	SET @stmt = CONCAT('SELECT * from ',@payments_summ_tbl,'  WHERE CONVERT(VARCHAR(10), payment_date,101) between ''',@pdate_from,''' AND ''',@pdate_to,''' ') 
  
	IF ISNULL(@vehicle_id,0)<>0  
		SET @stmt = CONCAT(@stmt,' AND vehicle_id = ',@vehicle_id)  

   SET @stmt= @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20)) + ' ' + IIF(@order_no=0,' ASC',' DESC'); 
 
 --print @stmt;

 EXEC(@stmt);
END

-- [dbo].[payment_history_summ_sel] @client_id=5 ,@pdate_from='10/04/2020',@pdate_to='12/5/2020'
-- select * from zsi_afcs_client_data.dbo.payments_summ_5