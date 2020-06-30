

CREATE PROCEDURE [dbo].[afcs_resend_code_upd]  
(  
   @username NVARCHAR(100)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @activation_code NVARCHAR(6);
	DECLARE @server_mail_profile_name NVARCHAR(20) = 'ZPayNotify';
	DECLARE @server_mail_subject NVARCHAR(50) = 'Welcome to zPay';
	DECLARE @server_mail_body_format NVARCHAR(10) = 'HTML';
	DECLARE @server_mail_body NVARCHAR(MAX) = '';
	DECLARE @count_register_email INT = 0;

	SELECT @activation_code = CAST(RAND() * 1000000 AS NVARCHAR(6));

	SET @server_mail_body = N'Welcome to zPay. Your activation code is ';
	SET @server_mail_body = @server_mail_body + @activation_code + '.';
	SET @server_mail_body = @server_mail_body + CHAR(13);
	SET @server_mail_body = @server_mail_body + 'This is an auto-generated email. Please do not reply.';

	SELECT @count_register_email = COUNT(consumer_id) FROM dbo.consumers WHERE 1 = 1 AND email = @username;

	IF @count_register_email = 1
	BEGIN
		BEGIN TRAN;

		UPDATE dbo.consumers
		SET activation_code = @activation_code WHERE 1 = 1
		AND email = @username;

		IF @@ERROR = 0
		BEGIN
			COMMIT;
			-- Email new user.
			EXEC msdb.dbo.sp_send_dbmail
				@profile_name = @server_mail_profile_name
			   , @recipients = @username
			   , @subject = @server_mail_subject
			   , @body = @server_mail_body
			   , @body_format = @server_mail_body_format
		END
		ELSE
		BEGIN
			ROLLBACK;
		END

		IF @@ERROR = 0
		BEGIN
			SELECT 
			'Y' is_valid
			, @activation_code AS activation_code
			, 'Activation code is sent to your email.' AS msg
		END
		ELSE
		BEGIN
			SELECT 
			'N' is_valid
			, @activation_code AS activation_code
			, 'An error occurred. Please contact system support.' AS msg
		END
	END
	ELSE
	BEGIN
		SELECT 
			'N' is_valid
			, @activation_code AS activation_code
			, 'User does not exist.' AS msg
	END
END;