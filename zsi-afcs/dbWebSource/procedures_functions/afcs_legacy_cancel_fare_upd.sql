

CREATE PROCEDURE [dbo].[afcs_legacy_cancel_fare_upd]  
(  
	  @device_hash_key NVARCHAR(30)
	, @hash_key NVARCHAR(MAX)
	, @user_id INT = 1
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @error INT = 0;
	DECLARE @device_id INT = 0;
	DECLARE @payment_id INT;
	DECLARE @amount DECIMAL(12, 2);
	DECLARE @qr_id INT;

	SELECT 
		@device_id = device_id
	FROM dbo.devices_v 
	WHERE 1 = 1
	AND hash_key = @device_hash_key
	AND is_active = 'Y'

	IF @device_id > 0
	BEGIN
		SELECT
			@payment_id = payment_id
			, @amount = total_paid_amount
			, @qr_id = qr_id
		FROM dbo.payments
		WHERE 1 = 1
		AND payment_key = @hash_key
		AND is_cancelled = 'N'

		IF @payment_id IS NOT NULL
		BEGIN
			BEGIN TRAN;

			UPDATE 
				dbo.payments
			SET
				is_cancelled = 'Y'
			WHERE 1 = 1
			AND payment_key = @hash_key;

			IF @@ERROR = 0
			BEGIN
				-- Insert into cancelled_fares table
				INSERT INTO [dbo].[cancelled_fares] (
					[payment_id]
					, [reason]
					, [created_by]
					, [created_date]
				) VALUES (
					@payment_id
					, 'Cancelled'
					, @user_id
					, DATEADD(HOUR, 8, GETUTCDATE())
				)

				-- For QR payments, update generated_qrs balance_amt to reflect the refunded amount.
				BEGIN
					DECLARE @balance_amount DECIMAL(12, 2);
					DECLARE @new_balance_amount DECIMAL(12, 2);

					SELECT @balance_amount = balance_amt FROM dbo.generated_qrs WHERE id = @qr_id;
					SET @new_balance_amount = ISNULL(@balance_amount, 0) + ISNULL(@amount, 0);

					UPDATE 
						dbo.generated_qrs
					SET
						balance_amt = @new_balance_amount
						, updated_by = @user_id
						, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
					WHERE 1 = 1
					AND id = @qr_id;
				END
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
					, 'Cancellation of transaction is successful. Refund amount is ' + CAST(@amount AS NVARCHAR(100)) + '.' AS msg
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
