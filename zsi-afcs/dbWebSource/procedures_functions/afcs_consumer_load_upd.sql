

CREATE PROCEDURE [dbo].[afcs_consumer_load_upd]  
(  
     @hash_key NVARCHAR(50)
   , @mobile_no NVARCHAR(300)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @consumer_id INT;
	DECLARE @consumer_generated_qr_id INT;
	DECLARE @current_consumer_credit_amount DECIMAL(12, 2);
	DECLARE @generated_qr_is_active NCHAR(1);
	DECLARE @generated_qr_id INT;
	DECLARE @generated_qr_amount DECIMAL(12, 2);
	DECLARE @expiry_date DATETIME = NULL;
	DECLARE @cur_date DATETIME = DATEADD(HOUR,8,GETUTCDATE())

	SELECT
		@consumer_id = consumer_id
	FROM dbo.consumers
	WHERE 1 = 1
	AND mobile_no = @mobile_no;

	SELECT 
		TOP 1
		@consumer_generated_qr_id = id
		, @current_consumer_credit_amount = balance_amt
		, @expiry_date = [expiry_date]
	FROM dbo.generated_qrs
	WHERE 1 = 1
	AND consumer_id = @consumer_id
	AND is_taken = 'Y'
	AND is_active = 'Y';

	SELECT 
		@generated_qr_id = id
		, @generated_qr_is_active = is_active
		, @generated_qr_amount = balance_amt
		, @expiry_date = [expiry_date]
	FROM dbo.generated_qrs 
	WHERE 1 = 1
	AND consumer_id IS NULL
	AND hash_key = @hash_key;

	IF ISNULL(@generated_qr_is_active, '') <> 'Y'
	BEGIN
		SELECT
			'N' AS is_valid
			, 'QR code is no longer valid.' AS load_msg
			, 0.00 AS amount_loaded
			, @current_consumer_credit_amount AS consumer_credit_amount
	END
	ELSE
	BEGIN
		BEGIN TRAN;

		DECLARE @new_consumer_amount DECIMAL(12, 2) = 0;
		SET @new_consumer_amount = ISNULL(@current_consumer_credit_amount, 0) + ISNULL(@generated_qr_amount, 0);

		-- Update the main qr of the consumer.
		UPDATE
			dbo.generated_qrs
		SET
			is_taken = 'Y'
			, balance_amt = @new_consumer_amount
			, updated_date = @cur_date
		WHERE 1 = 1
		AND id = @consumer_generated_qr_id;

		-- Update the transferred qr.
		UPDATE
			dbo.generated_qrs
		SET
			is_taken = 'Y'
			, is_active = 'N'
			, balance_amt = 0
			, consumer_id = @consumer_id
			, updated_by = @consumer_id
			, updated_date = @cur_date
		WHERE 1 = 1
		AND id = @generated_qr_id;

		IF @@ERROR = 0
		BEGIN
			COMMIT;
		END
		ELSE
		BEGIN
			ROLLBACK;
		END

		IF @@ERROR = 0
			SELECT
				'Y' AS is_valid
				, 'QR code loaded successfully.' AS load_msg
				, @generated_qr_amount AS amount_loaded
				, @new_consumer_amount AS consumer_credit_amount
				, @expiry_date AS [expiry_date]
	END
END;