CREATE PROCEDURE [dbo].[app_profile_email_upd]
@email_host	VARCHAR(100)
,@email_port	INT
,@email_add	VARCHAR(100)
,@email_add_desc	VARCHAR(100)
,@email_pwd	VARCHAR(50)
,@email_is_ssl	VARCHAR(1)
,@user_id	INT
AS
BEGIN
SET NOCOUNT ON;
UPDATE dbo.app_profile SET
email_host	= @email_host
,email_port	= @email_port
,email_add	= @email_add
,email_add_desc	= @email_add_desc
,email_pwd	= @email_pwd
,email_is_ssl	= @email_is_ssl
END
