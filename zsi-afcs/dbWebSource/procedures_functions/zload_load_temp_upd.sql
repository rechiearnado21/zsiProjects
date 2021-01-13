

CREATE PROCEDURE [dbo].[zload_load_temp_upd]  
(  
	@merchant_hash_key		NVARCHAR(MAX)
	, @user_hash_key		NVARCHAR(MAX)
	, @pin_1				NVARCHAR(MAX)
	, @mobile_no			NVARCHAR(11)
	, @load_amount			DECIMAL(12, 2)
	, @user_id				INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @consumer_id INT;
	DECLARE @consumer_mobile_no NVARCHAR(12);
	DECLARE @client_id INT;
	DECLARE @client_current_balance_amount DECIMAL(12, 2);
	DECLARE @client_mobile_no NVARCHAR(12);
	DECLARE @generated_qr_id INT;
	DECLARE @loader_id INT;
	DECLARE @otp NVARCHAR(6);
	DECLARE @otp_expiry_datetime DATETIME;
	
	SELECT @otp = CAST(RAND() * 1000000 AS NVARCHAR(6));
	SELECT @otp_expiry_datetime = DATEADD(HOUR, 2, GETDATE());

	IF ISNULL(@pin_1, '') <> ''
	BEGIN
	   	SELECT 
			@consumer_id = consumer_id 
			, @generated_qr_id = id
		FROM dbo.generated_qrs
		WHERE is_active = 'Y'
		AND hash_key = @pin_1;
	END
    ELSE IF ISNULL(@mobile_no, '') <> ''
	BEGIN
		SELECT 
			@consumer_id = consumer_id 
			, @consumer_mobile_no = mobile_no
			, @generated_qr_id = qr_id
		FROM dbo.consumers 
		WHERE is_active = 'Y'
		AND mobile_no = @mobile_no;

	END
	IF ISNULL(@consumer_id,0) = 0 AND ISNULL(@mobile_no, '') <> ''
	    SELECT
		'N' AS is_valid
	     , 'User account not found.' AS msg
    ELSE
	BEGIN
	   SELECT 
			@client_id = client_id 
			, @client_current_balance_amount = ISNULL(balance_amount, 0)
			, @client_mobile_no = client_mobile_no
		FROM zsi_crm.dbo.clients 
		WHERE 1 = 1 
		AND is_active = 'Y'
		AND hash_key = @merchant_hash_key;

		SELECT
			@loader_id = [user_id]
		FROM dbo.loading_personnels_active_v
		WHERE hash_key = @user_hash_key;

		IF @client_id IS NOT NULL
		BEGIN
			IF @client_current_balance_amount > @load_amount
			BEGIN
				BEGIN TRAN;

				-- Insert into loading_temp table to verify the OTP.
				INSERT INTO dbo.loading_temp (
					load_date
					, qr_id
					, load_amount
					, load_by
					, loading_branch_id
					, otp
					, otp_expiry_date
					, is_processed
				) VALUES (
					GETDATE()
					, @generated_qr_id
					, @load_amount
					, @loader_id
					, @client_id
					, @otp
					, @otp_expiry_datetime
					, 'N'
				)

				-- Insert new record in the sms_notifications table so that the merchant will be notified through sms of the OTP generated.
				INSERT INTO [dbo].[sms_notifications]
					([app_name]
					,[mobile_no]
					,[message]
					,[is_processed]
					,[created_by]
					,[created_date])
				VALUES(
					'zload'
					, @client_mobile_no
					, 'A load amount of PHP ' + CAST(@load_amount AS NVARCHAR(100)) + ' is entered through zLoad. Use this OTP ' 
						+ CAST(@otp AS NVARCHAR(100)) + ' to finalize the transaction. The OTP will expire on ' + CAST(@otp_expiry_datetime AS NVARCHAR(100)) + '.'
					, 'N'
					, @loader_id
					, GETDATE())

				IF @@ERROR = 0
				BEGIN
					COMMIT;
					SELECT
						'Y' AS is_valid
						, 'Transaction pending. Enter the OTP to finalize the transaction.' AS msg
				END
				ELSE
				BEGIN
					ROLLBACK;
					SELECT
						'N' AS is_valid
						, 'An error occurred while processing the transaction.' AS msg
				END
			END
			ELSE
			BEGIN
				SELECT
					'N' AS is_valid
					, 'Merchant balance is insufficient.' AS msg
			END
		END
		ELSE
		BEGIN
			SELECT
				'N' AS is_valid
				, 'Merchant account not found.' AS msg
		END
	END
END;