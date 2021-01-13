

CREATE PROCEDURE [dbo].[afcs_share_load_upd]  
(  
	  @username				NVARCHAR(MAX)
	, @otp					NVARCHAR(MAX)
	, @user_id				INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @consumer_id INT;
	DECLARE @consumer_current_balance_amount DECIMAL(12, 2);
	DECLARE @consumer_new_balance_amount DECIMAL(12, 2);
	DECLARE @consumer_mobile_no NVARCHAR(12);
	DECLARE @user_consumer_id INT;
	DECLARE @user_qr_id int;
	DECLARE @user_current_balance_amount DECIMAL(12, 2);
	DECLARE @user_new_balance_amount DECIMAL(12, 2);

	DECLARE @loading_temp_id INT;
	DECLARE @load_date DATETIME;
	DECLARE @load_temp_qr_id INT;
	DECLARE @load_amount DECIMAL(12, 2);
	DECLARE @load_by INT;
	DECLARE @loading_branch_id INT;

	SELECT 
		  @loading_temp_id = loading_temp_id 
		, @load_date = load_date
		, @load_temp_qr_id = qr_id
		, @load_amount = load_amount
		, @load_by = load_by
	FROM dbo.loading_temp 
	WHERE 1 = 1
	AND is_processed = 'N'
	AND otp = @otp
	AND otp_expiry_date >= DATEADD(HOUR, 8, GETUTCDATE());


	IF @loading_temp_id IS NOT NULL
	BEGIN
		SELECT 
			  @consumer_id = consumer_id 
			, @consumer_current_balance_amount = ISNULL(balance_amt, 0)
		FROM dbo.generated_qrs 
		WHERE is_active = 'Y'
		 AND  id = @load_temp_qr_id;

		IF @consumer_id IS NOT NULL
		   SELECT  @consumer_mobile_no = mobile_no FROM dbo.consumers WHERE consumer_id = @consumer_id and is_active='Y'

		BEGIN
		    SELECT @user_qr_id = qr_id, @user_consumer_id = consumer_id FROM dbo.consumers where mobile_no = @username
			SELECT @user_current_balance_amount = ISNULL(balance_amt, 0)
			FROM dbo.generated_qrs_registered_v
			WHERE id = @user_qr_id;

			IF @user_qr_id IS NOT NULL
			BEGIN
				IF @user_current_balance_amount > @load_amount
				BEGIN
					BEGIN TRAN;

					SET @consumer_new_balance_amount = @consumer_current_balance_amount + @load_amount;
					SET @user_new_balance_amount = @user_current_balance_amount - @load_amount;

					-- Update the main qr of the consumer.
					UPDATE
						dbo.generated_qrs
					SET
						balance_amt = @consumer_new_balance_amount
						, updated_by = @user_consumer_id
						, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
					WHERE 1 = 1
					AND id = @load_temp_qr_id;

					-- Update the balance amount of the client.
					UPDATE
						dbo.generated_qrs
					SET 
						balance_amt = @user_new_balance_amount
						, updated_by = @user_consumer_id
						, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
					WHERE id = @user_qr_id;

					-- Insert new record in the loading table.
					INSERT INTO dbo.loading (
						load_date
						, qr_id
						, load_amount
						, load_by
						, is_top_up
						, ref_no
						, consumer_id
					) VALUES (
						@load_date
						, @load_temp_qr_id
						, @load_amount
						, @user_consumer_id
						, 'Y'
						, 'ZP' + REPLACE(CAST(RAND() * 1000000 AS VARCHAR(20)),'.',0)
						, @consumer_id
					)
					
					-- Insert new record in the sms_notifications table so that the consumer will be notified through sms.
						INSERT INTO [dbo].[sms_notifications]
							([app_name]
							,[mobile_no]
							,[message]
							,[is_processed]
							,[created_by]
							,[created_date])
						VALUES(
							'zpay'
							, @username
							, 'You have sent an amount of PHP ' + CAST(@load_amount AS NVARCHAR(100)) + ' through ZPay Share a Load.'
							, 'N'
							, @load_by
							, DATEADD(HOUR, 8, GETUTCDATE()))

					IF isnull(@consumer_mobile_no,'')<>''
						INSERT INTO [dbo].[sms_notifications]
							([app_name]
							,[mobile_no]
							,[message]
							,[is_processed]
							,[created_by]
							,[created_date])
						VALUES(
							'zpay'
							, @consumer_mobile_no
							, 'You have received an amount of PHP ' + CAST(@load_amount AS NVARCHAR(100)) + ' through ZPay Share a Load.'
							, 'N'
							, @load_by
							, DATEADD(HOUR, 8, GETUTCDATE()))

					-- Update loading_temp table and set to is_processed = 'Y'
					UPDATE
						dbo.loading_temp
					SET
						is_processed = 'Y'
					WHERE 1 = 1
					AND loading_temp_id = @loading_temp_id;

					IF @@ERROR = 0
					BEGIN
						COMMIT;
						SELECT
							'Y' AS is_valid
							, 'Your transaction is successful.' AS msg
							, @load_amount AS amount_loaded
							, @user_new_balance_amount AS user_balance_amount
					END
					ELSE
					BEGIN
						ROLLBACK;
						SELECT
							'N' AS is_valid
							, 'Sorry, something went wrong while processing your request. Please try again later.' AS msg
							, @load_amount AS amount_loaded
							, @user_current_balance_amount AS user_balance_amount
					END
				END
				ELSE
				BEGIN
					SELECT
						'N' AS is_valid
						, 'Sorry, your ZPay balance is insufficient to continue this request.' AS msg
						, @load_amount AS amount_loaded
						, @user_current_balance_amount AS user_balance_amount
				END
			END
			ELSE
			BEGIN
				SELECT
					'N' AS is_valid
					, 'Sorry, the user is not registered. Please register the user first to enjoy the service' AS msg
					, @load_amount AS amount_loaded
					, 0 AS user_balance_amount
			END
		END
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 'Sorry, the OTP entered is no longer valid. Please create another request.' AS msg
			, 0 AS amount_loaded
			, 0 AS user_balance_amount
	END
END;
