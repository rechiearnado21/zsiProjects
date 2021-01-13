

CREATE PROCEDURE [dbo].[afcs_share_load_temp_upd]  
(  
	  @user_mobile_no	    NVARCHAR(MAX)
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
    DECLARE @user_qr_id int
	DECLARE @user_balance_amount DECIMAL(12, 2);
	DECLARE @consumer_balance_amount DECIMAL(12, 2);
	DECLARE @generated_qr_id INT;
	DECLARE @loader_id INT;
	DECLARE @otp NVARCHAR(6);
	DECLARE @otp_expiry_datetime DATETIME;
	
	
	SELECT @otp = REPLACE(CAST(RAND() * 1000000 AS NVARCHAR(6)),'.',0);
	SELECT @otp_expiry_datetime = DATEADD(HOUR, 2, DATEADD(HOUR, 8, GETUTCDATE()));

	IF ISNULL(@pin_1, '') <> ''
	BEGIN
	   	SELECT 
			@consumer_id = consumer_id 
          , @consumer_balance_amount = balance_amt
		  , @generated_qr_id = id
		FROM dbo.generated_qrs
		WHERE is_active = 'Y'
		AND hash_key = @pin_1;

		SELECT @consumer_mobile_no = mobile_no FROM dbo.consumers WHERE consumer_id = @consumer_id;
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
	IF ISNULL(@generated_qr_id,0)= 0
	    SELECT
		'N' AS is_valid
	     , 'Sorry, the user is not registered. Please register the user first to enjoy the service.' AS msg
    ELSE
	BEGIN
		IF ISNULL(@mobile_no, '') <> ''
			SELECT @consumer_balance_amount = balance_amt FROM dbo.generated_qrs WHERE [id] = @generated_qr_id;
		  
		SELECT @user_id = qr_id FROM dbo.consumers WHERE 1 = 1 AND mobile_no = @user_mobile_no;
		SELECT @user_balance_amount = balance_amt FROM dbo.generated_qrs_registered_v WHERE 1 = 1 AND id = @user_id;

		IF @user_balance_amount >= @load_amount
			BEGIN
				BEGIN TRAN;

				-- Insert into loading_temp table to verify the OTP.

				INSERT INTO dbo.loading_temp (
					load_date
					, qr_id
					, load_amount
					, load_by
					, otp
					, otp_expiry_date
					, is_processed
				) VALUES (
					DATEADD(HOUR, 8, GETUTCDATE())
					, @generated_qr_id
					, @load_amount
					, @consumer_id
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
					'zpay'
					, @user_mobile_no
					, 'A load amount of PHP ' + CAST(@load_amount AS NVARCHAR(100)) + ' is entered through zpay share a load. Use this OTP ' 
						+ CAST(@otp AS NVARCHAR(100)) + ' to finalize the transaction. The OTP will expire on ' + CAST(@otp_expiry_datetime AS NVARCHAR(100)) + '.'
					, 'N'
					, @user_id
					, DATEADD(HOUR, 8, GETUTCDATE()))

				IF @@ERROR = 0
				BEGIN
					COMMIT;
					SELECT
						'Y' AS is_valid
						, 'Your transaction is pending. Please enter the OTP to finalize the transaction.' AS msg
				END
				ELSE
				BEGIN
					ROLLBACK;
					SELECT
						'N' AS is_valid
						, 'Sorry, something went wrong while processing your request. Please try again later.' AS msg
				END
			END
			ELSE
			BEGIN
				SELECT
					'N' AS is_valid
					, 'Sorry, your ZPay balance is insufficient to continue this request.' AS msg
			END
		END
END;