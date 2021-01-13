CREATE FUNCTION [dbo].[getUserRole](
@user_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_role_name VARCHAR(100); 
      SELECT @l_role_name = concat(role_name,iif(is_admin='Y',' [Admin]','')) FROM dbo.users_v where user_id = @user_id
      RETURN @l_role_name;
END;



