
CREATE PROCEDURE [dbo].[afcs_consumer_payments_report_sel]  
(  
   @username NVARCHAR(300)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	
	DECLARE @consumer_id INT
	DECLARE @stmt nvarchar(max)

	SELECT 
		@consumer_id = consumer_id 
	FROM dbo.consumers 
	WHERE 1 = 1 
	AND mobile_no = @username;
	
	SET @stmt = CONCAT('SELECT top 1000
		a.payment_date
		, b.vehicle_plate_no
		, concat(''Ref. No. :'', qr_ref_no,'' | '', c.vehicle_type) vehicle_type
		, a.total_paid_amount
	FROM dbo.consumer_payments_',@consumer_id,'_v a
	JOIN dbo.active_vehicles_v b
	ON a.vehicle_id = b.vehicle_id
	JOIN dbo.fare_matrix c
	ON b.vehicle_type_id = c.fare_id
	WHERE 1 = 1
	ORDER BY payment_id DESC')
	EXEC(@stmt);
END;
-- [dbo].[afcs_consumer_payments_report_sel] @username = '09178997742'

