CREATE procedure [dbo].[payment_for_posting_sum_sel]
( 
 @client_id int 
 ,@user_id int = null

)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)='';
  DECLARE @payments_tbl nvarchar(20);
  DECLARE @drivers_v nvarchar(50);
  DECLARE @pao_v nvarchar(50);
  SET @payments_tbl = CONCAT('dbo.payments_',@client_id);

  SET @stmt = CONCAT('SELECT CONVERT(DATE,pt.payment_date) payment_date, pt.vehicle_id, vv.vehicle_plate_no, sum(pt.total_paid_amount) AS total_fare 
			    FROM ',@payments_tbl,' pt INNER JOIN dbo.active_vehicles_v vv ON
				pt.vehicle_id = vv.vehicle_id WHERE (ISNULL(pt.post_id, 0) = 0) 
				AND ISNULL(qr_id,0) <> 0 GROUP BY pt.vehicle_id, vv.vehicle_plate_no, 
				CONVERT(DATE,pt.payment_date) ') ;

   EXEC(@stmt);
END

--[dbo].[payment_for_posting_sum_sel] @client_id=1