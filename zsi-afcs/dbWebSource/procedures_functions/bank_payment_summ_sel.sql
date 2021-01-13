
CREATE procedure [dbo].[bank_payment_summ_sel]
( 
  @client_id  int  
 ,@user_id    int = null
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt VARCHAR(MAX)
  DECLARE @payments_tbl nvarchar(20); 
  DECLARE @driver_v nvarchar(50);
  DECLARE @pao_v nvarchar(50); 
  SET @payments_tbl = CONCAT('dbo.payments_',@client_id); 

  SET @stmt = CONCAT('SELECT total_sales, vehicle_plate_no, payment_date FROM (
                  SELECT sum(total_paid_amount) total_sales, vh.vehicle_plate_no,convert(date,pt.payment_date) payment_date 
				  FROM ', @payments_tbl, ' pt 
				  LEFT JOIN
                  dbo.active_vehicles_v AS vh ON pt.vehicle_id = vh.vehicle_id
				  GROUP BY vh.vehicle_plate_no, convert(date,pt.payment_date) 
				  ) x ');  
				  
  PRINT (@stmt)
  EXEC(@stmt);
END

-- [dbo].[bank_payment_summ_sel] @client_id=1 