
CREATE PROCEDURE [dbo].[dd_users_sel]
(
   @user_id  int = null
)
AS
BEGIN
      SELECT user_id, CONCAT(last_first_name,', ',first_name) full_name FROM dbo.users_v WHERE 1=1--is_afcs='''Y'; 
END



