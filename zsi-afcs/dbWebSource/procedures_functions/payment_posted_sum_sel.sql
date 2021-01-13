
CREATE procedure [dbo].[payment_posted_sum_sel]
( 
   @post_id int
  ,@client_id int
  ,@user_id int = null
)
AS
BEGIN
SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)='';
  SELECT post_id, payment_date, vehicle_id, vehicle_plate_no, sum(total_paid_amount) total_amount FROM (
	    SELECT post_id, convert(varchar(10), payment_date,101) payment_date, vehicle_id, vehicle_plate_no, total_paid_amount
		  FROM dbo.payments_transactions_posted_v  
	  	 WHERE client_id = @client_id and post_id = @post_id) as x
 GROUP BY payment_date, vehicle_plate_no, vehicle_id, post_id
 
  
END;