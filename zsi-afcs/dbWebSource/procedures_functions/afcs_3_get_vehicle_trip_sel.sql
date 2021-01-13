

CREATE PROCEDURE [dbo].[afcs_3_get_vehicle_trip_sel](
	  @vehicle_hash_key NVARCHAR(100)
	, @user_id    INT = NULL
)
AS
BEGIN
	DECLARE @trip_no INT;
	DECLARE @vehicle_plate_no NVARCHAR(20);
	DECLARE @start_odo  INT;
	DECLARE @is_open CHAR(1) = 'N';
	DEClARE @start_date DATE; 
	DECLARE @client_id  INT;
	DECLARE @vehicle_id INT;
	DECLARE @trip_hash_key NVARCHAR(100);
    DECLARE @stmt NVARCHAR(MAX);
	DECLARE @tbl_vehicle_trips NVARCHAR(50);

	CREATE TABLE #tbl_vehicle_trip (
	    trip_no int null,
		is_open char(1) null,
		start_odo int null,
		start_date date null,
		trip_hash_key NVARCHAR(100) null
	)
	
	SELECT @vehicle_id=vehicle_id,@vehicle_plate_no= vehicle_plate_no,@client_id = company_id FROM dbo.active_vehicles_v WHERE hash_key= @vehicle_hash_key;
	SET @tbl_vehicle_trips=CONCAT('dbo.vehicle_trips_',@client_id);

	
	SET @stmt = CONCAT('SELECT TOP 1 trip_no,is_open, 
	     start_odo,start_date,trip_hash_key FROM ',@tbl_vehicle_trips,
	   ' WHERE 1 = 1 AND vehicle_id = ',@vehicle_id,' ORDER BY trip_id DESC');

    insert into #tbl_vehicle_trip EXEC(@stmt);
	
	SELECT @trip_no=trip_no,@is_open=is_open, @start_odo=start_odo,@start_date=[start_date], @trip_hash_key=trip_hash_key 
	  FROM #tbl_vehicle_trip;
     
	DROP TABLE #tbl_vehicle_trip;

	IF ISNULL(@is_open, 'N') = 'Y'
	BEGIN
		SELECT @vehicle_plate_no vehicle_plate_no
			, @trip_no trip_no
			, @start_odo start_odo
			, @is_open is_open
			, @trip_hash_key trip_hash_key
	END
	ELSE
	BEGIN
		IF CAST(@start_date AS DATE) = CAST(DATEADD(HOUR, 8, GETUTCDATE()) AS DATE)
		BEGIN
			SELECT @vehicle_plate_no vehicle_plate_no
				, @trip_no + 1 trip_no
				, '' start_odo
				, 'Y' AS is_open
				, '' trip_hash_key
		END
		ELSE
		BEGIN
			SELECT @vehicle_plate_no vehicle_plate_no
				, 1 AS trip_no
				, '' start_odo
				, 'Y' AS is_open
				, @trip_hash_key trip_hash_key
		END     
	END	
	drop table #tbl_vehicle_trip;

END
