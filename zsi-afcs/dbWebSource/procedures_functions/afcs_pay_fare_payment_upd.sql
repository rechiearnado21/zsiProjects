


CREATE PROCEDURE [dbo].[afcs_pay_fare_payment_upd]  
(  
	  @username				NVARCHAR(MAX)
	, @vehicle_hash_key		NVARCHAR(MAX)
	, @payment_amount		DECIMAL(12, 2)
	, @user_id				INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @id INT
	DECLARE @consumer_id INT;
	DECLARE @consumer_generated_qr_id INT;
	DECLARE @current_consumer_credit_amount DECIMAL(12, 2);
	DECLARE @client_id INT;
	DECLARE @client_mobile_number NVARCHAR(12);
	DECLARE @vehicle_id INT;
	DECLARE @ref_no NVARCHAR(20);

	-- Get the primary record of a consumer in the generated_qrs table.
	SELECT
		@consumer_id = a.consumer_id
		, @consumer_generated_qr_id = b.id
		, @current_consumer_credit_amount = b.balance_amt
	FROM dbo.consumers a
	JOIN dbo.generated_qrs b
	ON a.consumer_id = b.consumer_id
	WHERE 1 = 1
	AND a.mobile_no = @username;

	SELECT 
		@client_id = a.company_id
		, @vehicle_id = a.vehicle_id
		, @client_mobile_number = b.client_mobile_no
	FROM dbo.active_vehicles_v a
	JOIN dbo.clients_v b
	ON a.company_id = b.client_id
	WHERE 1 = 1
	AND a.hash_key = @vehicle_hash_key;

	IF @consumer_generated_qr_id IS NOT NULL
	BEGIN
		BEGIN TRAN;

		IF @current_consumer_credit_amount > @payment_amount
		BEGIN
			DECLARE @new_consumer_credit_amount DECIMAL(12, 2) = 0;
			DECLARE @cur_date DATETIME = DATEADD(HOUR, 8, GETUTCDATE());

			SET @new_consumer_credit_amount = ISNULL(@current_consumer_credit_amount, 0) - ISNULL(@payment_amount, 0);

			-- Update the main qr of the consumer.
			UPDATE
				dbo.generated_qrs
			SET
				balance_amt = @new_consumer_credit_amount
				, updated_by = @consumer_id
				, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
			WHERE 1 = 1
			AND id = @consumer_generated_qr_id;

			-- Get the reference number.
			SET @ref_no = CONCAT('ZP', REPLACE(CAST(RAND() * + 1000000 AS NVARCHAR(6)), '.', 0))
			-- Insert record in the payments table.
				INSERT INTO [dbo].[payments](
					[payment_date]
					, [no_reg]
					, [reg_amount]
					, [consumer_id]
					, [vehicle_id]
					, [qr_id]
					, [client_id]
					, [qr_ref_no]
				)
				VALUES(
					  @cur_date
					, 1
					, @payment_amount
					, @consumer_id
					, @vehicle_id
					, @consumer_generated_qr_id
					, @client_id
					, @ref_no
				)

			-- Insert record in the sms_notifications table to send notification to the consumer.
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
				, 'A payment amount of ' + CAST(@payment_amount AS NVARCHAR(100)) + ' was made on ' + CAST(GETDATE() AS NVARCHAR(100)) + ' . Ref. No. ' + @ref_no + '.'
				, 'N'
				, @consumer_id
				, DATEADD(HOUR, 8, GETUTCDATE()));

			-- Insert record in the sms_notifications table to send notification to the merchant.
			INSERT INTO [dbo].[sms_notifications]
				([app_name]
				,[mobile_no]
				,[message]
				,[is_processed]
				,[created_by]
				,[created_date])
			VALUES(
				'zpay'
				, @client_mobile_number
				, 'You received a payment amount of ' + CAST(@payment_amount AS NVARCHAR(100)) + ' on ' + CAST(GETDATE() AS NVARCHAR(100)) + ' . Ref. No. ' + @ref_no + '.'
				, 'N'
				, @consumer_id
				, DATEADD(HOUR, 8, GETUTCDATE()));

			IF @@ERROR = 0
			BEGIN
				COMMIT;
				SELECT
					'Y' AS is_valid
					, 'ZPay payment is successful.' AS msg
			END
			ELSE
			BEGIN
				ROLLBACK;
				SELECT
					'N' AS is_valid
					, 'Sorry, there was a problem processing your request. Please try again later.' AS msg
			END
		END
		ELSE
		BEGIN
			SELECT
				'N' AS is_valid
				, 'Sorry, your credit is insufficient to process the payment. Your current balance is ' 
					+ CAST(@current_consumer_credit_amount AS NVARCHAR(100)) + '.' AS msg
		END
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 'Sorry, the user is not registered in zPay.' AS msg
	END
END;