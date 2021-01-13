
CREATE FUNCTION [dbo].[countRoleMenus] 
(
   @role_id AS INT
)
RETURNS INT
AS
BEGIN   
   DECLARE @retval INT;
     SELECT @retval = COUNT(*)  
       FROM dbo.role_menus WHERE role_id = @role_id;       
   RETURN @retval;
END





