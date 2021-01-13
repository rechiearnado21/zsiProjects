

CREATE PROCEDURE [dbo].[zload_load_upd]  
(  
	@merchant_hash_key		NVARCHAR(MAX)
	, @device_hash_key		NVARCHAR(MAX)
	, @user_hash_key		NVARCHAR(MAX)
	, @consumer_hash_key	NVARCHAR(MAX) = NULL
	, @mobile_no			NVARCHAR(12) = NULL
	, @load_amount			DECIMAL(12, 2)
	, @token				NVARCHAR(20)
	, @user_id				INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @loader_id INT;
	DECLARE @generated_qr_id INT;
	DECLARE @consumer_id INT;
	DECLARE @consumer_current_balance_amount DECIMAL(12, 2);
	DECLARE @consumer_new_balance_amount DECIMAL(12, 2);
	DECLARE @consumer_mobile_no NVARCHAR(12);
	DECLARE @client_id INT;
	DECLARE @client_current_balance_amount DECIMAL(12, 2);
	DECLARE @client_new_balance_amount DECIMAL(12, 2);
	DECLARE @generated_qr_hash_key NVARCHAR(MAX);
	DECLARE @ref_no NVARCHAR(30);
	DECLARE @device_token NVARCHAR(20);
	DECLARE @device_id INT;
	DECLARE @msg NVARCHAR(MAX)='';

	SELECT
		@loader_id = [id]
	FROM zsi_load.dbo.load_personnel
	WHERE 1 = 1
	AND emp_hash_key = @user_hash_key;

	IF ISNULL(@loader_id,0) = 0
	   SET @msg = 'Unathorized User. Transaction Failed.'
    ELSE	
	BEGIN
		SELECT 
			@client_id = client_id 
			, @client_current_balance_amount = ISNULL(balance_amount, 0)
		FROM zsi_crm.dbo.clients
		WHERE is_active = 'Y'
		AND hash_key = @merchant_hash_key;

		IF @client_id IS NULL
		   SET @msg = 'Unregistered Merchant. Transaction Failed.'
        ELSE
		BEGIN
			SELECT
				@device_token = token
				, @device_id = device_id
			FROM zsi_load.dbo.devices
			WHERE 1 = 1
			AND hash_key = @device_hash_key
			AND token =@token
		    AND company_id=@client_id;

			IF ISNULL(@device_id,0)<>0
			BEGIN	
				IF ISNULL(@mobile_no,'')<>''
					SELECT 
						@generated_qr_id = a.[id] 
						, @consumer_current_balance_amount = ISNULL(a.balance_amt, 0)
						, @consumer_mobile_no = b.mobile_no
						, @consumer_id = a.consumer_id
					FROM dbo.generated_qrs a
					JOIN dbo.consumers b
					ON a.consumer_id = b.consumer_id
					WHERE 1 = 1
					AND a.is_active = 'Y'
					AND b.mobile_no=@mobile_no;	
				ELSE
					SELECT 
						@generated_qr_id = a.[id] 
						, @consumer_current_balance_amount = ISNULL(a.balance_amt, 0)
						, @consumer_mobile_no = b.mobile_no
						, @consumer_id = a.consumer_id
					FROM dbo.generated_qrs a
					LEFT OUTER JOIN dbo.consumers b
					ON a.consumer_id = b.consumer_id
					WHERE 1 = 1
					AND a.is_active = 'Y'
					AND a.hash_key = @consumer_hash_key;
			
			   IF ISNULL(@generated_qr_id,0) = 0
			      SET @msg = 'Unregistered Account. Transaction Failed.'
			   ELSE
			   BEGIN
					SET @ref_no = CONCAT('ZM', REPLACE(CAST(RAND() * 1000000 AS NVARCHAR(30)), '.', 0));			
					SET @consumer_new_balance_amount = @consumer_current_balance_amount + @load_amount;
					SET @client_new_balance_amount = @client_current_balance_amount - @load_amount;
					BEGIN TRAN;
						UPDATE
							dbo.generated_qrs
						SET
							balance_amt = @consumer_new_balance_amount
							, updated_by = @client_id
							, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
						WHERE 1 = 1
						AND id = @generated_qr_id;
	
					-- Update the balance amount of the client.
					UPDATE
						zsi_crm.dbo.clients 
					SET 
						  balance_amount = @client_new_balance_amount
						, updated_by = @client_id
						, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
					WHERE 1 = 1
					AND client_id = @client_id;
					
					-- Insert new record in the loading table.
					INSERT INTO dbo.loading (
						load_date
						, qr_id
						, load_amount
						, device_id
						, load_by
						, is_top_up
						, loading_branch_id
						, ref_no
						, consumer_id
					) VALUES (
						DATEADD(HOUR, 8, GETUTCDATE())
						, @generated_qr_id
						, @load_amount
						, @device_id
						, @loader_id
						, 'N'
						, @client_id
						, @ref_no
						, @consumer_id
					)
					
					-- Insert new record in the sms_notifications table so that the consumer will be notified through sms.
					IF ISNULL(@consumer_mobile_no, '') <> ''
						INSERT INTO [dbo].[sms_notifications]
							([app_name]
							,[mobile_no]
							,[message]
							,[is_processed]
							,[created_by]
							,[created_date])
						VALUES(
							'zload'
							, @consumer_mobile_no
							, CONCAT('You have received an amount of PHP', CAST(@load_amount AS NVARCHAR(100)), ' through ZLoad. Reference No. ', @ref_no, '.')
							, 'N'
							, @loader_id
							, DATEADD(HOUR, 8, GETUTCDATE()))

					IF @@ERROR = 0
					BEGIN
						COMMIT;
						SELECT
							'Y' AS is_valid
							, CONCAT('Transaction successful. Reference No. ', @ref_no, '.') AS msg
							, @load_amount AS amount_loaded
							, @client_new_balance_amount AS merchant_balance_amount
							, @ref_no AS reference_no
					END
					ELSE
					BEGIN
						ROLLBACK;
						SELECT
							'N' AS is_valid
							, 'An error occurred while processing the transaction. Please try again later.' AS msg
							, @load_amount AS amount_loaded
							, @client_current_balance_amount AS merchant_balance_amount
							, '' AS reference_no
					END;
			   END;
			END;
		END;
	END;

    IF @msg <> ''
		SELECT
		'N' AS is_valid
		, @msg msg
		, @load_amount AS amount_loaded
		, 0 AS merchant_balance_amount
		, '' AS reference_no

END;