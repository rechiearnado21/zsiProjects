

CREATE PROCEDURE [dbo].[afcs_get_vehicle_trip_sel](
	  @vehicle_hash_key NVARCHAR(100)
	, @user_id    INT = NULL
)
AS
BEGIN
	DECLARE @trip_no INT;
	DECLARE @vehicle_plate_no NVARCHAR(20);
	DECLARE @start_odo  INT;
	DECLARE @start_odo2 INT;
	DECLARE @is_open CHAR(1) = 'N';
	DEClARE @start_date DATE; 
	DECLARE @client_id  INT;
	DECLARE @vehicle_id INT;
	DECLARE @trip_hash_key NVARCHAR(100);
    DECLARE @stmt NVARCHAR(MAX);
	DECLARE @tbl_vehicle_trips NVARCHAR(50);
	DECLARE @route_no INT;

	CREATE TABLE #tbl_vehicle_trip (
	    trip_no int null,
		is_open char(1) null,
		start_odo int null,
		start_date date null,
		trip_hash_key NVARCHAR(100) null,
		route_no INT NULL
	)
	
	SELECT @vehicle_id=vehicle_id,@vehicle_plate_no= vehicle_plate_no,@client_id = company_id, @start_odo2=odometer_reading FROM dbo.active_vehicles_v WHERE hash_key= @vehicle_hash_key;
	SET @tbl_vehicle_trips=CONCAT('dbo.vehicle_trips_',@client_id);

	
	SET @stmt = CONCAT('SELECT TOP 1 trip_no,is_open, 
	     start_odo,start_date,trip_hash_key,route_no FROM ',@tbl_vehicle_trips,
	   ' WHERE 1 = 1 AND vehicle_id = ',@vehicle_id,' ORDER BY trip_id DESC');

    insert into #tbl_vehicle_trip EXEC(@stmt);
	
	SELECT @trip_no=trip_no,@is_open=is_open, @start_odo=start_odo,@start_date=[start_date], @trip_hash_key=trip_hash_key, @route_no = route_no
	  FROM #tbl_vehicle_trip;
     
	DROP TABLE #tbl_vehicle_trip;

	IF ISNULL(@is_open, 'N') = 'Y'
	BEGIN
		SELECT @vehicle_plate_no vehicle_plate_no
			, @trip_no AS trip_no
			, @start_odo AS start_odo
			, @is_open AS is_open
			, @trip_hash_key AS trip_hash_key
			, @route_no AS route_no
	END
	ELSE
	BEGIN 
		IF CAST(@start_date AS DATE) = CAST(DATEADD(HOUR, 8, GETUTCDATE()) AS DATE)
		BEGIN
			SELECT @vehicle_plate_no vehicle_plate_no
				, @trip_no + 1 trip_no
				, '' AS start_odo
				, 'Y' AS is_open
				, '' trip_hash_key
				, @route_no AS route_no
		END
		ELSE
		BEGIN
			SELECT @vehicle_plate_no vehicle_plate_no
				, 1 AS trip_no
				, '' AS start_odo
				, 'Y' AS is_open
				, @trip_hash_key trip_hash_key
				, @route_no AS route_no
		END     
	END	
END
