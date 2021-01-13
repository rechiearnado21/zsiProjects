
CREATE PROCEDURE [dbo].[afcs_consumer_get_otp_sel]  
(  
   @username NVARCHAR(20)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @error INT = 0;
	DECLARE @consumer_id INT;
	DECLARE @otp NVARCHAR(6);
	DECLARE @otp_expiry_datetime DATETIME;
	DECLARE @cur_date DATETIME = DATEADD(HOUR,8,GETUTCDATE())
	
	SELECT @otp = CAST(RAND() * 1000000 AS NVARCHAR(6));
	SELECT @otp_expiry_datetime = DATEADD(HOUR, 2, @cur_date);
	SELECT @consumer_id = consumer_id FROM dbo.consumers WHERE 1 = 1 AND mobile_no = @username;

	IF @consumer_id IS NOT NULL
	BEGIN
		BEGIN TRAN;

		UPDATE
			dbo.consumers
		SET
			otp = @otp
			, otp_expiry_datetime = @otp_expiry_datetime
		WHERE 1 = 1
		AND consumer_id = @consumer_id;

		IF @@ERROR = 0
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
				, @username
				, 'Hi. Your OTP is ' + CAST(@otp AS NVARCHAR(6)) + ' and will expire on ' + CAST(@otp_expiry_datetime AS NVARCHAR(100)) + '.'
				, 'N'
				, @consumer_id
				, @cur_date
			);

			IF @@ERROR > 0
			BEGIN
				SET @error = 1
			END
		END
		ELSE
		BEGIN
			SET @error = 1
		END

		IF @error = 0
		BEGIN
			COMMIT;

			SELECT 
				'Y' is_valid
				, 'OTP is sent to your mobile number. Kindly check your messages.' AS msg
		END
		ELSE
		BEGIN
			ROLLBACK;

			SELECT 
				'N' is_valid
				, 'An error occurred while generating your OTP.' AS msg
		END
	END
	ELSE
	BEGIN
		SELECT 
			'N' is_valid
			, 'User not found.' AS msg
	END
END;