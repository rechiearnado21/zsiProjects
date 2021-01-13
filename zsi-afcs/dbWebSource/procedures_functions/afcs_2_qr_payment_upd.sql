
CREATE PROCEDURE [dbo].[afcs_2_qr_payment_upd]  
(  
     @hash_key1 NVARCHAR(MAX)
   , @hash_key2 NVARCHAR(MAX)=NULL
   , @base_fare DECIMAL(12, 2)
   , @regular_count INT
   , @student_count INT
   , @senior_count INT
   , @pwd_count INT
   , @regular_amount DECIMAL(12, 2)
   , @student_amount DECIMAL(12, 2)
   , @senior_amount DECIMAL(12, 2)
   , @pwd_amount DECIMAL(12, 2)
   , @vehicle_hash_key NVARCHAR(MAX)
   , @driver_hash_key NVARCHAR(MAX)
   , @trip_no INT
   , @pao_hash_key NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	DECLARE @id INT;
	DECLARE @error INT = 0;
	DECLARE @generated_qrs_id INT;
	DECLARE @consumer_id INT;
	DECLARE @new_credit_amount DECIMAL(12, 2);
	DECLARE @credit_amount DECIMAL(12, 2);
	DECLARE @total_amount DECIMAL(12, 2);
	DECLARE @mobile_no NVARCHAR(20);
	DECLARE @vehicle_id INT;
	DECLARE @driver_id INT;
	DECLARE @client_id INT;
	DECLARE @pao_id INT = NULL;
	DECLARE @is_client_qr CHAR(1)='N';
	DECLARE @stmt NVARCHAR(MAX);
	DECLARE @tbl_employees NVARCHAR(50);
	DECLARE @cur_date DATETIME = DATEADD(HOUR,8,GETUTCDATE())
	DECLARE @tbl_payment NVARCHAR(50);

	CREATE TABLE #driver_pao (
	  id           int
	 ,position_id  int
	)

	SELECT @client_id=company_id,@vehicle_id = vehicle_id FROM dbo.active_vehicles_v WHERE hash_key =@vehicle_hash_key;
	SET @tbl_employees = CONCAT('zsi_hcm.dbo.employees_',@client_id);
	SET @tbl_payment = CONCAT('dbo.payments_',@client_id)

	SET @stmt = CONCAT('SELECT id, position_id FROM ',@tbl_employees, ' WHERE position_id IN (3,4) 
	    AND emp_hash_key IN ( ''',isnull(@driver_hash_key,'Az'),''',''',isnull(@pao_hash_key,'Az'),'''')
	INSERT INTO #driver_pao EXEC(@stmt);

	SELECT @driver_id = id FROM #driver_pao WHERE position_id =3;
	SELECT @pao_id = id FROM #driver_pao WHERE position_id =4;

	-- Check whether the hash_key1 and hash_key2 exists in the generated_qrs table and is active.
	IF isnull(@hash_key2,'')=''
		SELECT 
			@generated_qrs_id = [id] 
		,@credit_amount = balance_amt 
		,@is_client_qr = 'Y'
		FROM dbo.generated_qrs 
		WHERE 1 = 1 AND is_active = 'Y' AND hash_key = @hash_key1 AND client_id = @client_id
	ELSE	
	SELECT 
		 @generated_qrs_id = [id] 
		,@credit_amount = balance_amt 
	FROM dbo.generated_qrs 
	WHERE 1 = 1 
	AND is_active = 'Y' AND hash_key = @hash_key1 AND hash_key2 = @hash_key2;

	IF @generated_qrs_id IS NOT NULL
	BEGIN
		SET @total_amount = ISNULL(@regular_amount, 0) + ISNULL(@student_amount, 0) + ISNULL(@senior_amount, 0) + ISNULL(@pwd_amount, 0);
	    SELECT @consumer_id = consumer_id, @mobile_no = mobile_no FROM dbo.consumers WHERE qr_id=@generated_qrs_id;
		
			IF @credit_amount >= @total_amount
			BEGIN
			    DECLARE @qr_ref_no nvarchar(20) 
				SET @qr_ref_no = 'ZP' + REPLACE(CAST(rand() * 1000000 as NVARCHAR(6)),'.',0)
 				BEGIN TRAN;

				-- Insert record in the payments table.
				INSERT INTO [dbo].[payments](
					[payment_date]
					, [no_reg]
					, [no_stu]
					, [no_sc]
					, [no_pwd]
					, [reg_amount]
					, [stu_amount]
					, [sc_amount]
					, [pwd_amount]
					, [consumer_id]
					, [vehicle_id]
					, [driver_id]
					, [trip_id]
					, [qr_id]
					, [base_fare]
					, [client_id]
					, [pao_id]
					, [qr_ref_no]
					, [is_client_qr]
					, [is_open]
				)
				VALUES(
					  @cur_date
					, @regular_count
					, @student_count
					, @senior_count
					, @pwd_count
					, @regular_amount
					, @student_amount
					, @senior_amount
					, @pwd_amount
					, @consumer_id
					, @vehicle_id
					, @driver_id
					, @trip_no
					, @generated_qrs_id
					, @base_fare
					, @client_id
					, @pao_id
					, @qr_ref_no
					, @is_client_qr
					, @is_client_qr

				)

					SET @new_credit_amount = @credit_amount - @total_amount;
					UPDATE 
						dbo.generated_qrs 
					SET
						  [balance_amt] = @new_credit_amount
						, [expiry_date] = DATEADD(MONTH,6,@cur_date)
						, [updated_by] = @consumer_id
						, [updated_date] = @cur_date
					WHERE 1 = 1
					AND id = @generated_qrs_id;
				END

				IF @@ERROR = 0
				BEGIN
					SET @id = @@IDENTITY
					SET @stmt = CONCAT('INSERT INTO ', @tbl_payment, ' SELECT * FROM dbo.payments WHERE payment_id=',@id)
	                EXEC(@stmt);					

				IF @consumer_id IS NOT NULL
				BEGIN
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
					   , CONCAT('A payment amount of PHP ',@total_amount,' was made on ',@cur_date,'. Ref# ', @qr_ref_no)
					   , 'N'
					   , @user_id
					   , @cur_date)

					COMMIT;

					SELECT 
						'Y' AS is_valid
						, 'Payment successful.' AS msg
				END
				ELSE
				BEGIN
					ROLLBACK;

					SELECT 
						'N' AS is_valid
						, 'An error occurred while processing the payment.' AS msg
				END
			END
			ELSE
			BEGIN
				SELECT 
					'N' AS is_valid
					, 'User has insufficient balance. Current balance is ' + CAST(@credit_amount AS NVARCHAR(100)) + '.' AS msg
			END
		END
		ELSE
		BEGIN
			SELECT 
				'N' AS is_valid
				, 'QR Not found.' AS msg
		END
END;


