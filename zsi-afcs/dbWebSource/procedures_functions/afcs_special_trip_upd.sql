

CREATE PROCEDURE [dbo].[afcs_special_trip_upd](  
	@vehicle_hash_key NVARCHAR(50)
	, @device_hash_key NVARCHAR(50)
	, @amount DECIMAL(12, 2)
	, @from_location NVARCHAR(100)
	, @to_location NVARCHAR(100)
	, @qr_hash_key1 NVARCHAR(MAX) = ''
	, @qr_hash_key2 NVARCHAR(MAX) = ''
	, @driver_id INT
	, @pao_id INT
	, @travel_date DATETIME
	, @payment_reference NVARCHAR(50)
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @id INT;
	DECLARE @generated_qrs_id INT;
	DECLARE @consumer_id INT;
	DECLARE @new_credit_amount DECIMAL(12, 2);
	DECLARE @credit_amount DECIMAL(12, 2);
	DECLARE @mobile_no NVARCHAR(20);
	DECLARE @vehicle_id INT;
	DECLARE @client_id INT;
	DECLARE @device_id INT = 0;
	DECLARE @or_number NVARCHAR(10);
	DECLARE @qr_ref_no NVARCHAR(20);
	DECLARE @is_client_qr CHAR(1) = 'N';
	DECLARE @stmt NVARCHAR(MAX);
	DECLARE @msg NVARCHAR(200) = '';
	DECLARE @tbl_client_payment NVARCHAR(50);

	SELECT 
		@client_id = company_id
		, @vehicle_id = vehicle_id
		, @or_number = or_no 
	FROM dbo.active_vehicles_v WHERE 1 = 1 
	AND hash_key = @vehicle_hash_key;

	SET @tbl_client_payment = CONCAT('dbo.payments_', @client_id);
	
	SELECT 
		@device_id = device_id
	FROM dbo.devices WHERE 1 = 1
	AND hash_key = @device_hash_key
	AND is_active = 'Y'
	AND company_id = @client_id;

	IF @device_id = 0
	   SET @msg = 'The device is not registered to process payment. Please register this device.'
	ELSE
	BEGIN
	    IF @qr_hash_key1 <> '' AND @qr_hash_key2 <> ''
		BEGIN
			SELECT 
				@generated_qrs_id = [id] 
				, @credit_amount = balance_amt 
			FROM dbo.generated_qrs 
			WHERE 1 = 1 
			AND is_active = 'Y' 
			AND hash_key = @qr_hash_key1 
			AND hash_key2 = @qr_hash_key2;
 
			IF ISNULL(@generated_qrs_id, 0) = 0 
			   SET @msg =  'Sorry, the scanned QR code is not valid. Please use a valid QR code.'
			ELSE
			BEGIN
				SELECT @consumer_id = consumer_id, @mobile_no = mobile_no FROM dbo.consumers WHERE 1 = 1 AND qr_id = @generated_qrs_id;
		
				IF @credit_amount < @amount
				   SET @msg = 'Sorry, an insufficient balance is found. Current balance is ' + CAST(@credit_amount AS NVARCHAR(100)) + '.'
				ELSE
				BEGIN
					SET @new_credit_amount = @credit_amount - @amount;
					SET @qr_ref_no = 'ZP' + replace(cast(rand() * + 1000000 as NVARCHAR(6)),'.',0)
				END
			END
		END
			   

        IF @msg = ''
		BEGIN
			BEGIN TRAN;
			INSERT INTO [dbo].[payments](
				[payment_date]
				, [total_paid_amount]
				, [consumer_id]
				, [vehicle_id]
				, [driver_id]
				, [qr_id]
				, [client_id]
				, [device_id]
				, [payment_key]
				, [pao_id]
				, [from_location]
				, [to_location]
				, [qr_ref_no]
				, [or_no]
				, [is_client_qr]
				, [is_open]
				, [is_cancelled]
			)
			VALUES(
				@travel_date
				, @amount
				, @consumer_id
				, @vehicle_id
				, @driver_id
				, @generated_qrs_id
				, @client_id
				, @device_id
				, @payment_reference
				, @pao_id
				, @from_location
				, @to_location
				, @qr_ref_no
				, @or_number
				, @is_client_qr
				, 'N'
				, 'N'
			)
           
			SET @id = @@IDENTITY			        

			IF @@ERROR = 0
			BEGIN
				SET @stmt = CONCAT('INSERT INTO ', @tbl_client_payment, ' SELECT * FROM dbo.payments WHERE payment_id = ', @id)
	            EXEC(@stmt);	

				IF @generated_qrs_id IS NOT NULL
					UPDATE 
						dbo.generated_qrs
					SET
						[balance_amt] = @new_credit_amount
						, [updated_by] = @consumer_id
						, [updated_date] = DATEADD(HOUR, 8, GETUTCDATE())
					WHERE 1 = 1
					AND id = @generated_qrs_id;

				IF @consumer_id IS NOT NULL
					-- Insert record in the sms_notifications table.
					INSERT INTO [dbo].[sms_notifications]
						([app_name]
						,[mobile_no]
						,[message]
						,[is_processed]
						,[created_by]
						,[created_date])
					VALUES(
						'zpay'
						, @mobile_no
						, 'A payment amount of ' + CAST(@amount AS NVARCHAR(100)) + ' was made on ' + CAST(GETDATE() AS NVARCHAR(100)) + ' . Ref.# '+ @qr_ref_no
						, 'N'
						, @user_id
						, DATEADD(HOUR, 8, GETUTCDATE()))

				UPDATE dbo.active_vehicles_v SET or_no = or_no + 1 WHERE 1= 1 AND vehicle_id = @vehicle_id
				COMMIT;

				SELECT 
					'Y' AS is_valid
					, 'Payment successful.' AS msg
					, @payment_reference AS payment_key
					, @or_number AS or_no
			END
			ELSE
			BEGIN
				ROLLBACK;

				SELECT 
					'N' AS is_valid
					, 'Sorry, something wen wrong while processing the payment. Please try again later.' AS msg
					, @payment_reference AS payment_key
					, '' AS or_no
			END
		END
        ELSE
		SELECT 
			'N' AS is_valid
			, @msg AS msg
			, '' AS payment_key
			, 0 AS current_balance_amount
			, '' AS or_no
	END
END;