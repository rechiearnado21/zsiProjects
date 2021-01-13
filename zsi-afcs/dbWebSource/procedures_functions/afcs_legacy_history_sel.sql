



CREATE PROCEDURE [dbo].[afcs_legacy_history_sel]  
(  
     @vehicle_hash_key NVARCHAR(MAX)
   , @history_date DATE
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	DECLARE @client_id  INT
	DECLARE @vehicle_id  INT
	DECLARE @tbl_payments NVARCHAR(50);
	DECLARE @tbl_vehicle_trips NVARCHAR(50);
	DECLARE @driver_v NVARCHAR(50);
	DECLARE @pao_v NVARCHAR(50);
	DECLARE @stmt      NVARCHAR(MAX);

	
	SELECT @client_id=company_id, @vehicle_id = vehicle_id FROM dbo.active_vehicles_v WHERE hash_key =@vehicle_hash_key;
	SET @tbl_payments = CONCAT('dbo.payments_',@client_id);
	SET @driver_v = CONCAT('zsi_hcm.dbo.employees_',@client_id,'_v');
	SET @pao_v = CONCAT('zsi_hcm.dbo.employees_',@client_id,'_v');
	SET @tbl_vehicle_trips = CONCAT('dbo.vehicle_trips_',@client_id);
	
	SET @stmt = CONCAT('SELECT
		  a.payment_date
		, b.trip_no
		, a.total_paid_amount
		, CONCAT(c.emp_lfm_name,''/'',d.emp_lfm_name) AS driver_name
		, b.vehicle_id
		, a.driver_id
	FROM ', @tbl_payments,' a
	LEFT JOIN ', @tbl_vehicle_trips ,
	' b ON a.trip_id = b.trip_id LEFT JOIN ', @driver_v, 
	' c ON a.driver_id = c.id LEFT JOIN ', @pao_v,
	' d ON a.pao_id = d.id
	WHERE a.vehicle_id=',@vehicle_id,' AND CAST(a.payment_date AS DATE) = ''', @history_date , 
	''' AND b.vehicle_id = ',@vehicle_id,' ORDER BY	payment_date');

	EXEC(@stmt);

END;



