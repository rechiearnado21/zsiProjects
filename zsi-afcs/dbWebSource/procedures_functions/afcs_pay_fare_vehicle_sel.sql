


CREATE PROCEDURE [dbo].[afcs_pay_fare_vehicle_sel]  
(  
	@vehicle_hash_key NVARCHAR(MAX)
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @vehicle_id INT;

	BEGIN
		SELECT @vehicle_id = vehicle_id FROM dbo.active_vehicles_v WHERE 1 = 1 AND hash_key = @vehicle_hash_key;

		IF @vehicle_id IS NOT NULL
			SELECT 
				'Y' AS is_valid
				, 'The scanned QR is a valid vehicle.' AS msg
		ELSE
			SELECT 
				'N' AS is_valid
				, 'Sorry, the scanned QR is not a valid vehicle.' AS msg
	END
END;