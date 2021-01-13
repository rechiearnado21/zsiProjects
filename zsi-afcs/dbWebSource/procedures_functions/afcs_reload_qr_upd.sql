

CREATE PROCEDURE [dbo].[afcs_reload_qr_upd]  
(  
   @device_hash_key NVARCHAR(MAX)
   , @hash_key NVARCHAR(50)
   , @payment_amount DECIMAL(12, 2)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @device_id INT = 0;
	DECLARE @generated_qr_id INT;
	DECLARE @current_balance_amount DECIMAL(12, 2);

	SELECT @device_id = device_id
		FROM dbo.devices WHERE 1 = 1
		AND hash_key = @device_hash_key
		AND is_active = 'Y'

	IF @device_id > 0
	BEGIN
		SELECT 
			@generated_qr_id = id
			, @current_balance_amount = balance_amt
		FROM dbo.generated_qrs_active_v WHERE 1 = 1
		AND hash_key = @hash_key
		AND is_active = 'Y'
		
		IF @generated_qr_id > 0
		BEGIN
			BEGIN TRAN;

			UPDATE 
				dbo.generated_qrs
			SET
				balance_amt = ISNULL(@current_balance_amount, 0) + ISNULL(@payment_amount, 0)
				, updated_by = @user_id
				, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
			WHERE 1 = 1
			AND id = @generated_qr_id

			INSERT INTO [dbo].[loading]
			   ([load_date]
			   ,[qr_id]
			   ,[load_amount]
			   ,[device_id]
			   ,[load_by])
			VALUES
			   (DATEADD(HOUR, 8, GETUTCDATE())
			   ,@generated_qr_id
			   ,@payment_amount
			   ,@device_id
			   ,@user_id)

			IF @@ERROR = 0
			BEGIN
				COMMIT;
				SELECT 
					'Y' AS is_valid
					, 'Load is successful.' AS msg
					, (@current_balance_amount + @payment_amount) AS current_balance_amount
			END
			ELSE
			BEGIN
				ROLLBACK;
				SELECT 
					'N' AS is_valid
					, 'Error occurred while loading the QR.' AS msg
					, @current_balance_amount AS current_balance_amount
			END
		END
	END
	ELSE
	BEGIN
		SELECT 
			'N' AS is_valid
			, 'Device is not registered to process payment.' AS msg
			, 0 AS current_balance_amount
	END
END;