
CREATE PROCEDURE [dbo].[afcs_2_daily_trip_sel]  
(  
     @vehicle_hash_key NVARCHAR(50)
   , @driver_hash_key NVARCHAR(50)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	
	DECLARE @trip_no INT;
	DECLARE @daily_amount DECIMAL(12,2);
	DECLARE @vehicle_id INT;
    DECLARE @vehicle_plate_no NVARCHAR(20);
	DECLARE @vehicle_type_id INT;
	DECLARE @vehicle_type NVARCHAR(50);
	DECLARE @driver_id INT;
	DECLARE @driver NVARCHAR(50);
	DECLARE @tbl_vehicle_trips NVARCHAR(50);
	DECLARE @stmt NVARCHAR(MAX);
    DECLARE @client_id  INT;
	DECLARE @tbl_employees NVARCHAR(50);
	CREATE TABLE #driver (
	   driver_id INT
	  ,first_name nvarchar(100)
	  ,last_name  nvarchar(100)	
	)
	CREATE TABLE #trip (
	   trip_no int 
	)

	SELECT @client_id=company_id, @vehicle_id=vehicle_id, @vehicle_plate_no=vehicle_plate_no, @vehicle_type_id = vehicle_type_id FROM dbo.active_vehicles_v WHERE hash_key =@vehicle_hash_key;
	SET @tbl_employees = CONCAT('zsi_hcm.dbo.employees_',@client_id);
	SET @tbl_vehicle_trips = CONCAT('dbo.vehicle_trips_',@client_id);

	SELECT @vehicle_type =vehicle_type FROM dbo.fare_matrix  WHERE fare_id = @vehicle_type_id
	SET @stmt = CONCAT('SELECT id, first_name, last_name FROM ',@tbl_employees,' WHERE emp_hash_key = ''', @driver_hash_key, '''')  
	INSERT INTO #driver EXEC(@stmt);
	SELECT @driver_id = driver_id, @driver = CONCAT(first_name, ' ', last_name) FROM #driver

	SELECT 
		@daily_amount = SUM(total_paid_amount) 
	FROM dbo.payments 
	WHERE 1 = 1 
	AND vehicle_id = @vehicle_id 
	AND driver_id = @driver_id
	AND CAST(payment_date AS DATE) = CAST(DATEADD(HOUR,8,GETUTCDATE()) AS DATE);

	SET @stmt = CONCAT('SELECT 	TOP 1 b.trip_no 
	FROM dbo.payments a LEFT JOIN ',@tbl_vehicle_trips,' b
	ON a.trip_id = b.trip_id WHERE 1 = 1 AND a.vehicle_id = ',@vehicle_id,' AND a.driver_id =', @driver_id,
	' AND CAST(a.payment_date AS DATE) = CAST(DATEADD(HOUR,8,GETUTCDATE()) AS DATE)
	ORDER BY a.payment_id DESC');

	INSERT INTO #trip EXEC(@stmt);
	IF (SELECT COUNT(*) FROM #trip) > 0
	   SELECT @trip_no =trip_no FROM #trip

    SELECT 
		@vehicle_id AS vehicle_id
		, @vehicle_plate_no AS vehicle_plate_no
		, @vehicle_type AS vehicle_type
		, @driver_id AS driver_id
		, @driver AS driver
		, ISNULL(@trip_no, 0) AS trip_no
		, ISNULL(@daily_amount, 0) AS daily_fare_collection  
END;

--[dbo].[afcs_2_daily_trip_sel] @vehicle_hash_key='8B0A68AC-BF01-4523-8542-0E4B7D6A481A', @driver_hash_key='13829D9E-8D00-4C78-A6D8-BB3DB26C8E79'


