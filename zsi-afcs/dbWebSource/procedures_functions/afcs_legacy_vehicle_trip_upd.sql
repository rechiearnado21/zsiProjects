
CREATE PROCEDURE [dbo].[afcs_legacy_vehicle_trip_upd](
  @trip_hash_key    NVARCHAR(100)=NULL OUTPUT
 ,@trip_no			INT=NULL 
 ,@vehicle_hash_key NVARCHAR(100)
 ,@driver_hash_key	NVARCHAR(100)=NULL
 ,@pao_hash_key		NVARCHAR(100)=NULL
 ,@start_odo		INT=NULL
 ,@end_odo			INT=NULL
 ,@is_open			CHAR(1)='Y'
 ,@route_hash_key	NVARCHAR(MAX)
 ,@route_no			NVARCHAR(20)
 ,@user_id			INT=NULL
)
AS
BEGIN
	DECLARE @error		INT = 0;
	DECLARE @trip_id    INT
	DECLARE @client_id  INT
	DECLARE @vehicle_id INT
	DECLARE @driver_id  INT
	DECLARE @pao_id     INT
	DECLARE @cur_date   DATETIME  = DATEADD(HOUR, 8, GETUTCDATE());
	DECLARE @msg        NVARCHAR(100);
	DECLARE @ttl_amount decimal(10,2)=0;
	DECLARE @tbl_employees NVARCHAR(50);
	DECLARE @tbl_vehicle_trips NVARCHAR(50);
	DECLARE @tbl_client_payment NVARCHAR(50);
	DECLARE @stmt      NVARCHAR(MAX);
	DECLARE @stmt_ins  NVARCHAR(MAX);
	DECLARE @stmt_upd  NVARCHAR(MAX);
	DECLARE @route_id INT;

    CREATE TABLE #driver_pao (
	   emp_id         int
	  ,is_driver      char(1)
	  ,is_pao         char(1)
	)

	CREATE TABLE #tbl_vehicle_trip (
	    trip_id int null,
	    trip_no int null,
		is_open char(1) null,
		start_odo int null,
		start_date date null,
		trip_hash_key NVARCHAR(100) null,
		route_no INT NULL
	)
	CREATE TABLE #tbl_payments(
	   payment_amt decimal(8,2)
	)

	SELECT @route_id = route_id FROM dbo.routes_ref WHERE 1 = 1 and route_hash_key = @route_hash_key;
	SELECT @client_id=company_id, @vehicle_id = vehicle_id FROM dbo.active_vehicles_v WHERE 1 = 1 AND hash_key = @vehicle_hash_key;
	SET @tbl_employees = CONCAT('zsi_hcm.dbo.employees_',@client_id);
	SET @tbl_vehicle_trips = CONCAT('dbo.vehicle_trips_',@client_id);
	SET @tbl_client_payment = CONCAT('dbo.payments_',@client_id)

	SET @stmt = CONCAT('SELECT id, is_driver, is_pao FROM ', @tbl_employees, ' WHERE 1 = 1 AND emp_hash_key IN (''',ISNULL(@driver_hash_key,'Az'),''',''',ISNULL(@pao_hash_key,'Bz'),''')');
	INSERT INTO #driver_pao EXEC(@stmt);

	SELECT @driver_id = emp_id FROM #driver_pao WHERE is_driver='Y'
	SELECT @pao_id = emp_id FROM #driver_pao WHERE is_pao='Y'

	BEGIN TRAN;
	IF @is_open = 'Y'
	BEGIN
	   
	    SET @stmt_ins = CONCAT('
			INSERT INTO ', @tbl_vehicle_trips,' (trip_no,start_date, start_odo,vehicle_id, driver_id,pao_id,trip_hash_key, is_open, route_id, route_no)
			VALUES (',@trip_no,',''',@cur_date,''',',@start_odo,',',@vehicle_id,',',isnull(@driver_id,0),',',isnull(@pao_id,0),',''', newid(),''',''Y'',',@route_id,',',@route_no,')'
		);
	 	EXEC(@stmt_ins);
		
		SET @stmt = CONCAT('
			SELECT TOP 1 trip_id,trip_no,is_open, 
			 start_odo,start_date,trip_hash_key,route_no FROM ',@tbl_vehicle_trips,
		   ' WHERE 1 = 1 AND vehicle_id = ',@vehicle_id,' ORDER BY trip_id DESC'
		);

		INSERT INTO #tbl_vehicle_trip EXEC(@stmt);
		SELECT @trip_id = trip_id, @trip_hash_key = trip_hash_key FROM #tbl_vehicle_trip

		SET @msg='Trip No. ' + cast(@trip_no as varchar(10)) + ' is started.'

	END
	ELSE
	BEGIN
		SET @stmt = CONCAT('SELECT TOP 1 trip_id,trip_no,is_open, 
			 start_odo,start_date,trip_hash_key,route_no FROM ',@tbl_vehicle_trips,
		   ' WHERE trip_hash_key =''',@trip_hash_key,'''');
		
		INSERT INTO #tbl_vehicle_trip EXEC(@stmt);
        SELECT @trip_id = trip_id FROM #tbl_vehicle_trip;

	    SET @stmt=CONCAT('INSERT INTO #tbl_payments SELECT total_paid_amount FROM ',@tbl_client_payment,' WHERE trip_id = ',@trip_id)
		EXEC(@stmt);

		SELECT @ttl_amount=sum(payment_amt) FROM #tbl_payments;
		
		DECLARE @no_kms INT;
		SET @no_kms = @end_odo - @start_odo;
		SET @stmt_upd = CONCAT('UPDATE ' ,@tbl_vehicle_trips,' SET end_date = ''',@cur_date,''', end_odo =', @end_odo,
		               ',is_open =''N'',no_kms = ', @no_kms,',total_collection_amt = ', ISNULL(@ttl_amount, 0),
					   ' WHERE trip_id =',@trip_id);
        
		EXEC(@stmt_upd);
		UPDATE zsi_fmis.dbo.vehicles SET odometer_reading=@end_odo WHERE vehicle_id = @vehicle_id;

		SET @msg='Trip No. ' + cast(@trip_no as varchar(10)) + ' is closed.'
	END;
	IF @@ERROR = 0
	BEGIN
		COMMIT;
		SELECT 
		      @trip_id AS trip_id
			, @trip_hash_key AS trip_hash_key
			, 'Y' AS is_valid
			, @msg AS msg
			, @is_open AS is_open
			, @route_no AS route_no
	END
	ELSE
	BEGIN
		ROLLBACK;
		SELECT 
		      @trip_id AS trip_id
			, @trip_hash_key AS trip_hash_key
			, 'N' AS is_valid
			, 'ERROR: Update not successful. Please try again.' AS msg
			, '' AS is_open
			, '' AS route_no
	END
	drop table #driver_pao;
	drop table #tbl_vehicle_trip;
	drop table #tbl_payments;
END;
