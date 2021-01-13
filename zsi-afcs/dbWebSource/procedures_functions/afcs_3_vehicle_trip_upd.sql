CREATE PROCEDURE [dbo].[afcs_3_vehicle_trip_upd](
  @trip_hash_key    NVARCHAR(100)=NULL OUTPUT
 ,@trip_no			INT=NULL 
 ,@vehicle_hash_key NVARCHAR(100)
 ,@driver_hash_key	NVARCHAR(100)=NULL
 ,@pao_hash_key		NVARCHAR(100)=NULL
 ,@start_odo		INT=NULL
 ,@end_odo			INT=NULL
 ,@is_open			CHAR(1)=NULL
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
	DECLARE @stmt      NVARCHAR(MAX);
	DECLARE @stmt_ins  NVARCHAR(MAX);
	DECLARE @stmt_upd  NVARCHAR(MAX);
    CREATE TABLE #driver_pao (
	   emp_id         int
	  ,position_id    int
	)

	CREATE TABLE #tbl_vehicle_trip (
	    trip_id int null,
	    trip_no int null,
		is_open char(1) null,
		start_odo int null,
		start_date date null,
		trip_hash_key NVARCHAR(100) null
	)


	SELECT @client_id=company_id, @vehicle_id = vehicle_id FROM dbo.active_vehicles_v WHERE hash_key =@vehicle_hash_key;
	SET @tbl_employees = CONCAT('zsi_hcm.dbo.employees_',@client_id);
	SET @tbl_vehicle_trips = CONCAT('dbo.vehicle_trips_',@client_id);

	SET @stmt = CONCAT('SELECT id, position_id FROM ', @tbl_employees, ' WHERE emp_hash_key IN (''',ISNULL(@driver_hash_key,'Az'),''',''',ISNULL(@pao_hash_key,'Bz'),''')');
	INSERT INTO #driver_pao EXEC(@stmt);

	SELECT @driver_id = emp_id FROM #driver_pao WHERE position_id=3
	SELECT @pao_id = emp_id FROM #driver_pao WHERE position_id=4

	BEGIN TRAN;
	IF @is_open = 'Y'
	BEGIN
	   
	    SET @stmt_ins = CONCAT('INSERT INTO ', @tbl_vehicle_trips,' (trip_no,start_date, start_odo,vehicle_id, driver_id,pao_id,trip_hash_key, is_open)
		VALUES (',@trip_no,',''',@cur_date,''',',@start_odo,',',@vehicle_id,',',isnull(@driver_id,0),',',isnull(@pao_id,0),',''', newid(),''',''Y'')')
	 	EXEC(@stmt_ins);
		
		SET @stmt = CONCAT('SELECT TOP 1 trip_id,trip_no,is_open, 
			 start_odo,start_date,trip_hash_key FROM ',@tbl_vehicle_trips,
		   ' WHERE 1 = 1 AND vehicle_id = ',@vehicle_id,' ORDER BY trip_id DESC');

		INSERT INTO #tbl_vehicle_trip EXEC(@stmt);
		SELECT @trip_id = trip_id, @trip_hash_key = trip_hash_key FROM #tbl_vehicle_trip

		SET @msg='Trip No. ' + cast(@trip_no as varchar(10)) + ' is started.'

	END
	ELSE
	BEGIN
		SET @stmt = CONCAT('SELECT TOP 1 trip_id,trip_no,is_open, 
			 start_odo,start_date,trip_hash_key FROM ',@tbl_vehicle_trips,
		   ' WHERE trip_hash_key =''',@trip_hash_key,'''');

		INSERT INTO #tbl_vehicle_trip EXEC(@stmt);
        SELECT @trip_id = trip_id FROM #tbl_vehicle_trip;

	    SELECT @ttl_amount=sum(total_paid_amount) FROM dbo.payments WHERE trip_id = @trip_id
		GROUP BY trip_id, vehicle_id;

		SET @stmt_upd = CONCAT('UPDATE ' ,@tbl_vehicle_trips,' SET end_date = ''',@cur_date,''', end_odo=', @end_odo,
		               ',is_open=''N'',no_kms = (',@end_odo,'-start_odo), total_collection_amt= ', @ttl_amount,
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
	END
	drop table #driver_pao;
	drop table #tbl_vehicle_trip;
END;



