CREATE PROCEDURE [dbo].[user_role_access]
(@user_id INT)
AS
BEGIN
  SELECT is_admin, role_id FROM dbo.users_v WHERE user_id=@user_id 
END





