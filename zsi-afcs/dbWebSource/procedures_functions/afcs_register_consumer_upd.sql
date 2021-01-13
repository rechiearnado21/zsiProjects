

CREATE PROCEDURE [dbo].[afcs_register_consumer_upd]  
(  
     @mobile_no nvarchar(20)
   , @email NVARCHAR(100)=NULL
   , @first_name NVARCHAR(300)
   , @middle_name NVARCHAR(300)=NULL
   , @last_name NVARCHAR(300)
   , @password NVARCHAR(50)
   , @birthdate DATE = NULL
   , @image_filename NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @id INT;
	DECLARE @generated_qr_id INT;
	DECLARE @activation_code NVARCHAR(6);
	DECLARE @server_mail_profile_name NVARCHAR(20) = 'ZPayNotify';
	DECLARE @server_mail_subject NVARCHAR(50) = 'Welcome to zPay';
	DECLARE @server_mail_body_format NVARCHAR(10) = 'HTML';
	DECLARE @server_mail_body NVARCHAR(MAX) = '';
	DECLARE @count_register_mobile INT = 0;
	DECLARE @count_register_email INT = 0;
	DECLARE @msg nvarchar(100)=null;
	DECLARE @cur_date DATETIME = DATEADD(HOUR,8,GETUTCDATE())

	SELECT @activation_code = REPLACE(CAST(RAND() * 1000000 AS NVARCHAR(6)),'.',0);

	SET @server_mail_body = N'Welcome to zPay. Your activation code is ';
	SET @server_mail_body = @server_mail_body + @activation_code + '.';
	SET @server_mail_body = @server_mail_body + CHAR(13);
	SET @server_mail_body = @server_mail_body + 'This is an auto-generated email. Please do not reply.';

	SELECT @count_register_mobile = COUNT(consumer_id) FROM dbo.consumers WHERE 1 = 1 AND mobile_no = @mobile_no;
	SELECT @count_register_email = COUNT(consumer_id) FROM dbo.consumers WHERE 1 = 1 AND email = @email;

	IF @count_register_mobile <> 0 
	   SET @msg = 'Mobile Number is already registered.'
    
	IF @count_register_email <> 0 
	   SET @msg = 'Email account is already registered.'

	IF @count_register_mobile = 0 AND @count_register_email=0
	BEGIN
		BEGIN TRAN;

		INSERT INTO [dbo].[consumers]
			( is_active
			, hash_key
			, first_name
			, middle_name
			, last_name
			, email
			, mobile_no
			, [password]
			, created_by
			, created_date
			, activation_code
			, birthdate
			, image_filename
			, activation_code_expiry
		)
		VALUES
			( 'N'
			, newid()
			, @first_name
			, @middle_name
			, @last_name
			, @email
			, @mobile_no
			, dbo.securityEncrypt(@password)
			, @user_id
			, @cur_date
			, @activation_code
			, IIF(@birthdate = '', NULL, @birthdate)
			, CAST(N'' AS xml).value('xs:base64Binary(sql:variable("@image_filename"))', 'varbinary(max)')
			, dateadd(minute,30, @cur_date)
		);

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
			, 'Welcome to zPay. Your activation code is ' + CAST(@activation_code AS NVARCHAR(100)) + '. Registration will expire in 30 mins. if not activated.'
			, 'N'
			, @user_id
			, @cur_date
		);

		IF @@ERROR = 0
		BEGIN
			COMMIT;

			IF ISNULL(@email, '') <> ''
			BEGIN
				-- Email new user.
				EXEC msdb.dbo.sp_send_dbmail
					@profile_name = @server_mail_profile_name
				   , @recipients = @email
				   , @subject = @server_mail_subject
				   , @body = @server_mail_body
				   , @body_format = @server_mail_body_format
			END;

			SELECT 
				'Y' is_valid
				, 'Registration is successful. Activation code is sent to your mobile number or email. Registration will expire in 30 minutes if not activated. ' AS msg
		END
		ELSE
		BEGIN
			ROLLBACK;
			SELECT 
				'N' is_valid
				, 'An error occurred. Please try again later.' AS msg
		END
	END
	ELSE
	BEGIN
		SELECT 
			'N' is_valid
			, @msg AS msg
	END
END;

