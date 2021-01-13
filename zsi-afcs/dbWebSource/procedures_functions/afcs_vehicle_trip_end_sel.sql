

CREATE PROCEDURE [dbo].[afcs_vehicle_trip_end_sel]  
(  
     @client_hash_key NVARCHAR(MAX)
   , @device_hash_key NVARCHAR(MAX)
   , @trip_hash_key NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @client_id INT;
	DECLARE @device_id INT;
	DECLARE @tbl_vehicle_trips NVARCHAR(50);
	DECLARE @tbl_client_payment NVARCHAR(50);
	DECLARE @sql NVARCHAR(MAX);
	DECLARE @trip_id INT;
	DECLARE @trip_no INT;
	DECLARE @trip_start_date DATETIME;
	DECLARE @trip_end_date DATETIME;
	DECLARE @total_cash_amount DECIMAL(12, 2);
	DECLARE @total_qr_amount DECIMAL(12, 2);

	SELECT @client_id = client_id FROM dbo.clients_v WHERE 1 = 1 AND hash_key = @client_hash_key;
	SET @tbl_vehicle_trips = CONCAT('dbo.vehicle_trips_', @client_id);
	SET @tbl_client_payment = CONCAT('dbo.payments_', @client_id);
	SET @sql = CONCAT(
		'SELECT
			@trip_id = trip_id
			, @trip_no = trip_no
			, @trip_start_date = start_date
			, @trip_end_date = end_date
		FROM ', @tbl_vehicle_trips, ' WHERE 1 = 1 AND trip_hash_key = ''', @trip_hash_key, ''''
	);
	EXEC sp_executesql @sql, N'
			@trip_id INT OUTPUT
			, @trip_no INT OUTPUT
			, @trip_start_date DATETIME OUTPUT
			, @trip_end_date DATETIME OUTPUT'
		, @trip_id OUTPUT
		, @trip_no OUTPUT
		, @trip_start_date OUTPUT
		, @trip_end_date OUTPUT;


	IF @client_id IS NOT NULL
	BEGIN
		SELECT 
			@device_id = device_id 
		FROM dbo.devices WHERE 1 = 1 
		AND hash_key = @device_hash_key
		and company_id = @client_id;

		IF @device_id IS NOT NULL
		BEGIN
			SET @sql = CONCAT(
				'SELECT
					@total_cash_amount = SUM(total_paid_amount)
				FROM ', @tbl_client_payment, ' WHERE 1 = 1 AND qr_id is NULL AND is_cancelled = ''N'' AND trip_id = ''', @trip_id, ''''
			);
			EXEC sp_executesql @sql, N'
					@total_cash_amount DECIMAL(12, 2) OUTPUT'
				, @total_cash_amount OUTPUT;


			SET @sql = CONCAT(
				'SELECT
					@total_qr_amount = SUM(total_paid_amount)
				FROM ', @tbl_client_payment, ' WHERE 1 = 1 AND qr_id is NOT NULL AND is_cancelled = ''N'' AND trip_id = ''', @trip_id, ''''
			);
			EXEC sp_executesql @sql, N'
					@total_qr_amount DECIMAL(12, 2) OUTPUT'
				, @total_qr_amount OUTPUT;


			SELECT
				'Y' AS is_valid
				, 'Success' AS msg
				, @trip_no AS trip_no
				, @trip_start_date AS trip_start_date
				, @trip_end_date AS trip_end_date
				, ISNULL(@total_cash_amount, 0) AS total_cash_amount
				, ISNULL(@total_qr_amount, 0) AS total_qr_amount
		END
		ELSE
		BEGIN
			SELECT 
				'N' is_valid
				, 'The device info is no longer valid. Please scan a valid device QR code.' AS msg
		END
	END
	ELSE
	BEGIN
		SELECT 
			'N' is_valid
			, 'The client info is no longer valid. Please scan a valid client QR code.' AS msg
	END
END;