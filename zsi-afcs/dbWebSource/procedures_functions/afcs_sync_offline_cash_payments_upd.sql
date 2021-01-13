

CREATE PROCEDURE [dbo].[afcs_sync_offline_cash_payments_upd]
(
     @tt    payments_tt READONLY
   , @user_id INT = NULL
)
AS

BEGIN
	SET NOCOUNT ON;

	DECLARE @id INT;
	DECLARE @error INT = 0;
	DECLARE @vehicle_id INT;
	DECLARE @client_id INT;
	DECLARE @device_id INT = 0;
--	DECLARE @trip_id INT;
	DECLARE @stmt NVARCHAR(MAX);
	DECLARE @ins_stmt NVARCHAR(MAX);
--	DECLARE @tbl_vehicle_trips NVARCHAR(50);
	DECLARE @tbl_client_payment NVARCHAR(50);
--	DECLARE @tbl_trip TABLE (
--	    trip_id int
--	);
--	DECLARE @route_id INT;
--	DECLARE @trip_hash_key NVARCHAR(MAX);

	SELECT 
		  @client_id = company_id
		, @vehicle_id = vehicle_id
	FROM dbo.active_vehicles_v 
	WHERE hash_key = (SELECT TOP 1 vehicle_hash_key FROM @tt)

	
--	SET @tbl_vehicle_trips = CONCAT('dbo.vehicle_trips_', @client_id);
	SET @tbl_client_payment = CONCAT('dbo.payments_', @client_id);
	

    SELECT 
		@device_id = device_id
	FROM dbo.devices 
	WHERE hash_key = (SELECT TOP 1 device_hash_key FROM @tt)

     CREATE TABLE #cash_payments (
	     [id] int identity
	 	,[payment_reference] [nvarchar](50)
		,[payment_date] [datetime]
		,[device_hash_key] [nvarchar](max) 
		,[base_fare] [decimal](12, 2)
		,[regular_count] [int]
		,[student_count] [int]
		,[senior_count] [int]
		,[pwd_count] [int]
		,[regular_amount] [decimal](12, 2)
		,[student_amount] [decimal](12, 2) 
		,[senior_amount] [decimal](12, 2)
		,[pwd_amount] [decimal](12, 2)
		,[total_paid_amount] [decimal](12, 2)
		,[vehicle_hash_key] [nvarchar](max) 
		,[driver_id] [int] 
		,[trip_hash_key] [nvarchar](max)
		,[pao_id] [int]
		,[route_hash_key] [nvarchar](max) 
		,[from_location] [nvarchar](100)
		,[to_location] [nvarchar](100)
		,[travel_distance] [decimal](12, 2)
		,[is_cancelled] [char](1)
		,[vehicle_id] [int] 
		,[client_id]  [int] 
		,[device_id]  [int] 
		,[trip_id]    [int] 
		,[route_id]   [int] 	
		,[is_client_qr] [char](1)
		,[is_open] [char](1)
	 )

    INSERT INTO #cash_payments (
	 	 payment_reference
		,payment_date
		,device_hash_key
		,base_fare
		,regular_count
		,student_count
		,senior_count
		,pwd_count
		,regular_amount
		,student_amount
		,senior_amount
		,pwd_amount
		,total_paid_amount
		,vehicle_hash_key
		,driver_id
		,trip_hash_key
		,pao_id
		,route_hash_key
		,from_location
		,to_location
		,travel_distance
		,is_cancelled
		,vehicle_id
		,client_id
		,device_id
		,trip_id
		,route_id
		,is_client_qr
		,is_open
	)
	    SELECT 
	 	 payment_reference
		,payment_date
		,device_hash_key
		,base_fare
		,regular_count
		,student_count
		,senior_count
		,pwd_count
		,regular_amount
		,student_amount
		,senior_amount
		,pwd_amount
		,isnull(regular_amount,0) + isnull(student_amount,0)+isnull(senior_amount,0)+isnull(pwd_amount,0) total_amount
		,vehicle_hash_key
		,driver_id
		,trip_hash_key
		,pao_id
		,route_hash_key
		,from_location
		,to_location
		,travel_distance
		,'N'
		,@vehicle_id
		,@client_id
		,@device_id
		,null
		,null
		,'N'
		,'Y'
    FROM @tt

    UPDATE a SET a.route_id= b.route_id
	FROM #cash_payments a, dbo.routes_ref b
	WHERE a.route_hash_key=b.route_hash_key;

	SET @stmt = concat('UPDATE a SET a.trip_id=b.trip_id FROM #cash_payments a, dbo.vehicle_trips_',@client_id,' b WHERE a.trip_hash_key = b.trip_hash_key');
	EXEC(@stmt);

	DECLARE @ctr int=1, @rec int=0
	SELECT 
		@rec = COUNT([id]) 
	FROM #cash_payments WHERE 1 = 1 
	
	WHILE @ctr <= @rec
	BEGIN
	BEGIN TRAN;
		INSERT INTO [dbo].[payments] (
			  [payment_date]
			, [no_reg]
			, [no_stu]
			, [no_sc]
			, [no_pwd]
			, [reg_amount]
			, [stu_amount]
			, [sc_amount]
			, [pwd_amount]
			, [total_paid_amount]
			, [vehicle_id]
			, [driver_id]
			, [base_fare]
			, [client_id]
			, [device_id]
			, [trip_id]
			, [payment_key]
			, [pao_id]
			, [route_id]
			, [from_location]
			, [to_location]
			, [no_klm]
			, [is_cancelled]
			, [is_client_qr]
			, [is_open]
		)
		SELECT 
			  [payment_date]
			, [regular_count]
			, [student_count]
			, [senior_count]
			, [pwd_count]
			, [regular_amount] 
			, [student_amount]
			, [senior_amount]
			, [pwd_amount] 
			, [total_paid_amount]
			, [vehicle_id]
			, [driver_id]
			, [base_fare]
			, [client_id]
			, [device_id]
			, [trip_id]
			, [payment_reference]
			, [pao_id]
			, [route_id]
			, [from_location]
			, [to_location]
			, [travel_distance]
			, [is_cancelled] 
			, [is_client_qr]
			, [is_open]
		FROM #cash_payments a WHERE 1 = 1
		AND [id] = @ctr
		AND NOT EXISTS (
			SELECT 
				payment_key 
			FROM dbo.payments b 
            WHERE 1 = 1 
			AND a.payment_reference = b.payment_key
		)
 
		--SET @id = @@IDENTITY;

		BEGIN
			SET @ins_stmt = CONCAT('
				INSERT INTO ', @tbl_client_payment, '(
					[payment_id]
					, [payment_date]
					, [no_reg]
					, [no_stu]
					, [no_sc]
					, [no_pwd]
					, [reg_amount]
					, [stu_amount]
					, [sc_amount]
					, [pwd_amount]
					, [total_paid_amount]
					, [vehicle_id]
					, [driver_id]
					, [base_fare]
					, [client_id]
					, [device_id]
					, [trip_id]
					, [payment_key]
					, [pao_id]
					, [route_id]
					, [from_location]
					, [to_location]
					, [no_klm]
					, [is_cancelled]
					, [is_client_qr]
					, [is_open])
				SELECT 
					a.[payment_id]
					, a.[payment_date]
					, a.[no_reg]
					, a.[no_stu]
					, a.[no_sc]
					, a.[no_pwd]
					, a.[reg_amount] 
					, a.[stu_amount]
					, a.[sc_amount]
					, a.[pwd_amount] 
					, a.[total_paid_amount]
					, a.[vehicle_id]
					, a.[driver_id]
					, a.[base_fare]
					, a.[client_id]
					, a.[device_id]
					, a.[trip_id]
					, a.[payment_key]
					, a.[pao_id]
					, a.[route_id]
					, a.[from_location]
					, a.[to_location]
					, a.[no_klm]
					, a.[is_cancelled]	
					, a.[is_client_qr]
					, a.[is_open]
				FROM dbo.payments a
				JOIN #cash_payments b
				ON a.payment_key = b.payment_reference
				WHERE 1 = 1 
				AND b.payment_reference NOT IN (
					SELECT 
						payment_key 
					FROM ', @tbl_client_payment, '
					WHERE 1 = 1 
				)'
			);

			EXEC(@ins_stmt);
		END;
		
		IF @@ERROR = 0
		BEGIN
			COMMIT;
		END
		ELSE
		BEGIN			
			ROLLBACK;
		END
		SET @ctr = @ctr + 1;
	END;
	DROP TABLE #cash_payments;
END;