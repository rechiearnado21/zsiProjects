

CREATE PROCEDURE [dbo].[afcs_legacy_update_trip_upd](
	@vehicle_hash_key		NVARCHAR(100)
	, @trip_hash_key		NVARCHAR(100)
	, @route_no				INT
	, @user_id				INT = NULL
)
AS
BEGIN
	DECLARE @trip_id    INT
	DECLARE @client_id  INT
	DECLARE @tbl_vehicle_trips NVARCHAR(50);
	DECLARE @sql  NVARCHAR(MAX);
	DECLARE @stmt_upd  NVARCHAR(MAX);

	SELECT 
		@client_id = company_id
	FROM dbo.active_vehicles_v 
	WHERE 1 = 1 
	AND hash_key = @vehicle_hash_key;
	
	SET @tbl_vehicle_trips = CONCAT('dbo.vehicle_trips_', @client_id);
	SET @sql = CONCAT(
		'SELECT
			@trip_id = trip_id
		FROM ', @tbl_vehicle_trips, ' WHERE 1 = 1 AND trip_hash_key = ''', @trip_hash_key, ''''
	);
	EXEC sp_executesql @sql, N'
			@trip_id INT OUTPUT'
		, @trip_id OUTPUT;

	IF @client_id IS NOT NULL AND @trip_id IS NOT NULL
	BEGIN
		BEGIN TRAN;   
	    SET @stmt_upd = CONCAT('
			UPDATE ', @tbl_vehicle_trips,' SET route_no = ', @route_no, ' WHERE 1 = 1 AND trip_id = ', @trip_id
		);
	 	EXEC(@stmt_upd);

		IF @@ERROR = 0
		BEGIN
			COMMIT;
			SELECT 
				'Y' AS is_valid
				, 'Updating of the trip is successful.' AS msg
		END
		ELSE
		BEGIN
			ROLLBACK;
			SELECT 
				  'N' AS is_valid
				, 'Sorry, there was an error when updating the trip.' AS msg
		END
	END
	ELSE
	BEGIN
		SELECT 
			'N' AS is_valid
			, 'The trip selected is not valid.' AS msg
	END
END;
