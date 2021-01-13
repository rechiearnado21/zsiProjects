
CREATE PROCEDURE [dbo].[afcs_cancel_payment_upd]  
(  
	@device_hash_key NVARCHAR(30)
	, @hash_key NVARCHAR(MAX)
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @error INT = 0;
	DECLARE @device_id INT = 0;
	DECLARE @generated_qr_id INT;
	DECLARE @amount DECIMAL(12, 2);

	SELECT 
		@device_id = device_id
	FROM dbo.devices 
	WHERE 1 = 1
	AND hash_key = @device_hash_key
	AND is_active = 'Y'

	IF @device_id > 0
	BEGIN
		SELECT
			@generated_qr_id = id
			, @amount = balance_amt
		FROM dbo.generated_qrs
		WHERE 1 = 1
		AND hash_key = @hash_key
		AND is_taken = 'Y'

		IF @generated_qr_id IS NOT NULL
		BEGIN
			BEGIN TRAN;

			UPDATE 
				dbo.generated_qrs
			SET
				is_taken = 'N'
				, balance_amt = 0
				, consumer_id = NULL
				, is_loaded = NULL
				, ref_trans = NULL
				, updated_by = @user_id
				, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
			WHERE 1 = 1
			AND hash_key = @hash_key;

			IF @@ERROR = 0
			BEGIN
				INSERT INTO [dbo].[cancelled_payments] (
					[generated_qr_id]
					,[amount]
					,[created_by]
					,[created_date]
				) VALUES (
					@generated_qr_id
					, @amount
					, @user_id
					, DATEADD(HOUR, 8, GETUTCDATE())
				)
			END
			ELSE
			BEGIN
				SET @error = 1;
			END

			IF @error = 0
			BEGIN
				COMMIT;
				SELECT 
					'Y' AS is_valid
					, 'Cancellation of transaction is successful. Amount to refund is ' + CAST(@amount AS NVARCHAR(100)) + '.' AS msg
					, @amount AS current_balance
			END
			ELSE
			BEGIN
				ROLLBACK;
				SELECT 
					'N' AS is_valid
					, 'Cancellation of transaction has failed.' AS msg
					, @amount AS current_balance
			END
		END
		ELSE
		BEGIN
			SELECT 
			'Y' AS is_valid
			, 'QR code is no longer valid.' AS msg
			, 0 AS current_balance
		END
	END
	ELSE
	BEGIN
		SELECT 
			'N' AS is_valid
			, 'Device is not registered to process this transaction.' AS msg
			, 0 AS current_balance
	END
END;