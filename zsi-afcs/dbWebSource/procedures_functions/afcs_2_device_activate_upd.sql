
CREATE PROCEDURE [dbo].[afcs_2_device_activate_upd]  
(  
   @activation_code NVARCHAR(50)
   , @serial_no NVARCHAR(50)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @error INT = 0;
	DECLARE @company_id INT = NULL;
	DECLARE @email_add NVARCHAR(50);

	DECLARE @server_mail_profile_name NVARCHAR(20) = 'ZFareNotify';
	DECLARE @server_mail_subject NVARCHAR(50) = 'Device Activation';
	DECLARE @server_mail_body_format NVARCHAR(10) = 'HTML';
	DECLARE @server_mail_body NVARCHAR(MAX) = '';

	SET @server_mail_body = N'A device, with the serial number ' + @serial_no + ', is activated under your account.';
	SET @server_mail_body = @server_mail_body + CHAR(13);
	SET @server_mail_body = @server_mail_body + 'If this device is not under your account, advise your system administrator immediately!';
	SET @server_mail_body = @server_mail_body + CHAR(13);
	SET @server_mail_body = @server_mail_body + CHAR(13);
	SET @server_mail_body = @server_mail_body + 'This is an auto-generated email. Please do not reply.';

	SELECT
		@company_id = company_id
		, @email_add = email_add
	FROM dbo.company_info WHERE 1 = 1
	AND company_code = @activation_code;

	IF @company_id IS NOT NULL
	BEGIN
		DECLARE @count INT;

		-- Check if the device is already registered.
		SELECT @count = COUNT(device_id) FROM dbo.devices WHERE 1 = 1 AND serial_no = @serial_no;

		IF @count = 0
		BEGIN
			BEGIN TRAN;
			INSERT INTO [dbo].[devices](
				[serial_no]
				,[is_active]
				,[company_id]
				,[created_by]
				,[created_date]
			)
			VALUES(
				@serial_no
				, 'Y'
				, @company_id
				, @user_id
				, DATEADD(HOUR, 8, GETUTCDATE())
			)

			IF @@ERROR = 0
			BEGIN
				COMMIT;

				---- TEST
				--SET @email_add = 'drchanix@gmail.com';
			
				---- Email the company regarding the activation of a device.
				--IF LTRIM(RTRIM(ISNULL(@email_add, ''))) <> ''
				--BEGIN
				--	EXEC msdb.dbo.sp_send_dbmail
				--		@profile_name = @server_mail_profile_name
				--		, @recipients = @email_add
				--		, @subject = @server_mail_subject
				--		, @body = @server_mail_body
				--		, @body_format = @server_mail_body_format
				--END
			END
			ELSE
			BEGIN
				ROLLBACK;

				SET @error = 1;
			END
		END
		ELSE
		BEGIN
			UPDATE dbo.devices SET 
				is_active = 'Y'
				, updated_by  = @user_id 
				, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
			WHERE 1 = 1 
			AND serial_no = @serial_no;
		END
	END
	ELSE
	BEGIN
		SET @error = 1;
	END

	IF @error = 0
	BEGIN
		SELECT 
			'Y' AS is_valid
			, 'Success' AS msg
	END
	ELSE
	BEGIN
		SELECT 
			'N' AS is_valid
			, 'Error' AS msg
	END
END;