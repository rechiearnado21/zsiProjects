create FUNCTION [dbo].[getRole](
@role_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_role_name VARCHAR(100); 
      SELECT @l_role_name = role_name FROM dbo.roles where role_id = @role_id
      RETURN @l_role_name;
END;

