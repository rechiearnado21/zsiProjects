

CREATE PROCEDURE [dbo].[afcs_consumer_topup_upd]  
(  
     @username		NVARCHAR(100)
   , @pin_1			NVARCHAR(MAX)
   , @pin_2			NVARCHAR(MAX)
   , @load_amount	DECIMAL(12, 2)
   , @user_id		INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	DECLARE @id INT
	DECLARE @consumer_id INT;
	DECLARE @consumer_generated_qr_id INT;
	DECLARE @current_consumer_credit_amount DECIMAL(12, 2);
	DECLARE @generated_qr_id INT;
	DECLARE @generated_qr_consumer_id INT;
	DECLARE @generated_qr_amount DECIMAL(12, 2);

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
          @generated_qr_consumer_id = consumer_id
	    , @generated_qr_id = id
		, @generated_qr_amount = balance_amt
	FROM dbo.generated_qrs 
	WHERE 1 = 1
	AND ISNULL(is_active, '') = 'Y'
	AND hash_key = @pin_1
	AND hash_key2 = @pin_2;

	IF @generated_qr_id IS NULL
	BEGIN
		SELECT
			'N' AS is_valid
			, 'QR code does not exist.' AS msg
			, 0.00 AS amount_loaded
			, @current_consumer_credit_amount AS consumer_credit_amount
	END
	ELSE
	BEGIN
		BEGIN TRAN;
		IF @generated_qr_amount >= @load_amount
		BEGIN
		DECLARE @new_consumer_amount DECIMAL(12, 2) = 0;
		SET @new_consumer_amount = ISNULL(@current_consumer_credit_amount, 0) + ISNULL(@load_amount, 0);

		-- Update the main qr of the consumer.
		UPDATE
			dbo.generated_qrs
		SET
			is_taken = 'Y'
			, balance_amt = @new_consumer_amount
			, updated_by = @consumer_id
			, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
		WHERE 1 = 1
		AND id = @consumer_generated_qr_id;

		-- Update the transferred qr.
		UPDATE
			dbo.generated_qrs
		SET
			balance_amt = balance_amt - @load_amount
			, updated_by = @consumer_id
			, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
		WHERE 1 = 1
		AND id = @generated_qr_id;

		-- insert new record
		INSERT INTO dbo.loading (
			load_date
			, qr_id
			, load_amount
			, device_id
			, load_by
			, is_top_up
			, consumer_id
		) VALUES (
			DATEADD(HOUR, 8, GETUTCDATE())
			, @consumer_generated_qr_id
			, @load_amount
			, @generated_qr_id
			, @generated_qr_consumer_id
			, 'Y'
			, @consumer_id
		)
		SET @id = @@IDENTITY;

        UPDATE dbo.loading set ref_no = 'ZL' + REPLACE(CAST(RAND() * 1000000 AS VARCHAR(6)),'.',0) WHERE loading_id=@id
		IF @@ERROR = 0
		BEGIN
			COMMIT;
		END
		ELSE
		BEGIN
			ROLLBACK;
		END

		IF @@ERROR = 0
		BEGIN
			SELECT
				'Y' AS is_valid
				, 'QR code loaded successfully.' AS msg
				, @load_amount AS amount_loaded
				, @new_consumer_amount AS consumer_credit_amount
		END
		ELSE
		BEGIN
			SELECT
				'N' AS is_valid
				, 'Error occurred while loading the QR code.' AS msg
				, @load_amount AS amount_loaded
				, @new_consumer_amount AS consumer_credit_amount
		END
	END
	ELSE
		SELECT
		'N' AS is_valid
		, 'Error: Load amount exceeds QR balance.' AS msg
		, @load_amount AS amount_loaded
		, @new_consumer_amount AS consumer_credit_amount

	END
END;

