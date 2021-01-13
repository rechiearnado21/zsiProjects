

CREATE PROCEDURE [dbo].[afcs_pay_merchant_upd]  
(  
	  @username				NVARCHAR(MAX)
	, @merchant_hash_key	NVARCHAR(MAX)
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
	DECLARE @current_client_balance_amount DECIMAL(12, 2);
	DECLARE @client_mobile_number NVARCHAR(12);
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
          @client_id = client_id
	    , @current_client_balance_amount = ISNULL(balance_amount, 0)
		, @client_mobile_number = client_mobile_no
	FROM dbo.clients_v 
	WHERE 1 = 1
	AND hash_key = @merchant_hash_key;

	IF @consumer_generated_qr_id IS NOT NULL
	BEGIN
		BEGIN TRAN;

		IF @current_consumer_credit_amount > @payment_amount
		BEGIN
			DECLARE @new_consumer_credit_amount DECIMAL(12, 2) = 0;
			DECLARE @new_client_balance_amount DECIMAL(12, 2) = 0;

			SET @new_consumer_credit_amount = ISNULL(@current_consumer_credit_amount, 0) - ISNULL(@payment_amount, 0);
			SET @new_client_balance_amount = ISNULL(@current_client_balance_amount, 0) + ISNULL(@payment_amount, 0);

			-- Update the main qr of the consumer.
			UPDATE
				dbo.generated_qrs
			SET
				balance_amt = @new_consumer_credit_amount
				, updated_by = @consumer_id
				, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
			WHERE 1 = 1
			AND id = @consumer_generated_qr_id;

			-- Update the balance amount of the client.
			UPDATE
				[zsi_crm].dbo.clients
			SET
				balance_amount = @new_client_balance_amount
				, updated_by = @consumer_id
				, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
			WHERE 1 = 1
			AND client_id = @client_id;
			
			-- Get the reference number.
			SET @ref_no = CONCAT('ZP',replace(cast(rand() * + 1000000 as NVARCHAR(6)),'.',0))
			INSERT INTO dbo.merchant_payments (
			      merchant_payment_date
				, client_id
				, qr_id
				, payment_amount
				, consumer_id
				, payment_ref_no
			) VALUES (
				  DATEADD(HOUR, 8, GETUTCDATE())
                , @client_id
				, @consumer_generated_qr_id
				, @payment_amount
				, @consumer_id
				, @ref_no
			)
			--SET @id = @@IDENTITY;
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
					, 'Merchant payment is successful.' AS msg
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