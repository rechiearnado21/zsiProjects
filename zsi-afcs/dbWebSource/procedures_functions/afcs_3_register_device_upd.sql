


CREATE PROCEDURE [dbo].[afcs_3_register_device_upd]  
(  
     @client_hash_key NVARCHAR(MAX)
   , @device_hash_key NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @client_id INT;
	DECLARE @device_id INT;
	DECLARE @is_active CHAR(1);

	SELECT @client_id = client_id FROM dbo.clients_v WHERE 1 = 1 AND hash_key = @client_hash_key;
	IF @client_id IS NOT NULL
	BEGIN
		SELECT 
			@device_id = device_id 
			, @is_active = is_active
		FROM dbo.devices WHERE 1 = 1 
		AND hash_key = @device_hash_key;

		IF @device_id IS NOT NULL
		BEGIN
			IF UPPER(@is_active) = 'Y'
			BEGIN
				SELECT 
					'N' is_valid
					, 'The device is already registered.' AS msg
			END
			ELSE
			BEGIN
				BEGIN TRAN;
				UPDATE dbo.devices SET 
					is_active = 'Y'
					, updated_by = @client_id
					, updated_date = GETDATE()
				WHERE 1 = 1
				AND device_id = @device_id;

				IF @@ERROR = 0
				BEGIN
					COMMIT;
					SELECT 
						'Y' is_valid
						, 'The device is successfully registered.' AS msg
				END
				ELSE
				BEGIN
					ROLLBACK;
					SELECT 
						'N' is_valid
						, 'An error occurred while regsitering the device. Please try again later.' AS msg
				END
			END
		END
		ELSE
		BEGIN
			SELECT 
				'N' is_valid
				, 'The device QR code is invalid. Please select a valid QR code.' AS msg
		END
	END
	ELSE
	BEGIN
		SELECT 
			'N' is_valid
			, 'The client QR code is invalid. Please select a valid QR code.' AS msg
	END
END;