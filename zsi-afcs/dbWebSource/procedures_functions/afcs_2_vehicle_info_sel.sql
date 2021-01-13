
CREATE PROCEDURE [dbo].[afcs_2_vehicle_info_sel]  
(  
   @user_id INT = NULL
   , @hash_key NVARCHAR(50)
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @vehicle_id INT;

	-- Check whether the vehicle is registered and active.
	SELECT @vehicle_id = vehicle_id FROM dbo.active_vehicles_v WHERE 1 = 1 AND hash_key = @hash_key;

	IF @vehicle_id IS NOT NULL
	BEGIN
		SELECT
			a.[vehicle_id]
			, a.[hash_key]
			, a.[vehicle_plate_no]
			, a.[vehicle_type_id]
			, b.[vehicle_type]
			, a.[is_active]
			, 'Y' AS is_valid
			, 'Success' AS msg
		FROM dbo.active_vehicles_v a
		JOIN dbo.fare_matrix b
		ON a.vehicle_type_id = b.fare_id
		WHERE 1 = 1
		AND hash_key = @hash_key;
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 'Error' AS msg
	END
END;