CREATE PROCEDURE [dbo].[app_profile_email_sel]
@user_id INT
AS
BEGIN
SET NOCOUNT ON;
SELECT email_host, email_port, email_add, email_add_desc, email_pwd, email_is_ssl FROM app_profile
END
