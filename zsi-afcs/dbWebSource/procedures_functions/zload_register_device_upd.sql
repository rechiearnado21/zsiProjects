

CREATE PROCEDURE [dbo].[zload_register_device_upd]  
(  
   @user_id INT = NULL
   , @merchant_hash_key NVARCHAR(MAX)
   , @device_hash_key NVARCHAR(MAX)
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @client_id INT;
	DECLARE @client_name NVARCHAR(100);
	DECLARE @device_id INT;

	SELECT 
		@client_id = client_id 
		, @client_name = client_name
	FROM zsi_crm.dbo.clients
	WHERE 1 = 1
	AND hash_key = @merchant_hash_key;

	IF @client_id IS NOT NULL
	BEGIN
		SELECT 
			@device_id = device_id 
		FROM zsi_load.dbo.devices
		WHERE 1 = 1
		AND company_id = @client_id
		AND hash_key = @device_hash_key;

		IF @device_id IS NOT NULL
		BEGIN
			BEGIN TRAN;
			UPDATE 
				zsi_load.dbo.devices 
			SET 
				is_active = 'Y' 
				, updated_by = 1
				, updated_date = GETDATE()
			WHERE 1 = 1
			AND device_id = @device_id;

			IF @@ERROR = 0
			BEGIN
				COMMIT;
				SELECT 
					'Y' AS is_valid
					, 'The device is successfully registered.' AS msg
					, @client_name AS client_name
			END
			ELSE
			BEGIN
				ROLLBACK;
				SELECT 
					'N' AS is_valid
					, 'There was an error registering the device. Please try again later.' AS msg
					, '' AS client_name
			END
		END
		ELSE
		BEGIN
			SELECT 
				'N' AS is_valid
				, 'The device QR code is not valid. Please use a valid device QR code.' AS msg
				, '' AS client_name
		END
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 'The merchant QR code is not valid. Please use a valid merchant QR code.' AS msg
			, '' AS client_name
	END
END;