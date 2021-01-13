
CREATE PROCEDURE [dbo].[dd_route_sel]
(
   @user_id  int = null
)
AS
BEGIN
      SELECT route_id, CONCAT(route_code,' » ', route_desc) route FROM dbo.routes_ref; 
END

