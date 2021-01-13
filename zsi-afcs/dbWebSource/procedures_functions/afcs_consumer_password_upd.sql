

CREATE PROCEDURE [dbo].[afcs_consumer_password_upd]  
(  

	@username NVARCHAR(20)
	, @otp NVARCHAR(6)
	, @new_password NVARCHAR(50)
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @consumer_id INT;
	DECLARE @count_otp INT;

	SELECT @consumer_id = consumer_id FROM dbo.consumers WHERE 1 = 1 AND mobile_no = @username;

	IF @consumer_id IS NOT NULL
	BEGIN
		-- Check if the OTP is not yet expired and valid.
		SELECT 
			@count_otp = COUNT(consumer_id) 
		FROM dbo.consumers 
		WHERE 1 = 1 
		AND mobile_no = @username 
		AND otp = @otp 
		AND otp_expiry_datetime > DATEADD(HOUR, 8, GETUTCDATE());

		IF @count_otp > 0
		BEGIN
			BEGIN TRAN;

			UPDATE 
				dbo.consumers
			SET
				[password] = dbo.securityEncrypt(@new_password)
			WHERE 1 = 1
			AND consumer_id = @consumer_id;

			IF @@ERROR = 0
			BEGIN
				COMMIT;
		
				SELECT
					'Y' AS is_valid
					, 'Success' AS msg
			END
			ELSE
			BEGIN
				ROLLBACK;

				SELECT
					'N' AS is_valid
					, 'An error occurred while updating your password.' AS msg
			END
		END
		ELSE
		BEGIN
			SELECT 
				'N' is_valid
				, 'OTP is no longer valid.' AS msg
		END
	END
	ELSE
	BEGIN
		SELECT 
			'N' is_valid
			, 'User not found.' AS msg
	END
END;