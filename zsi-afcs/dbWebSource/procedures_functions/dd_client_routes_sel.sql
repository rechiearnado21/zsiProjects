
CREATE PROCEDURE [dbo].[dd_client_routes_sel]
(
    @user_id  INT = null
   ,@client_id	INT

)
AS
BEGIN
      SELECT CONCAT(route_code,' > ', route_desc) route, route_id FROM dbo.client_routes_v WHERE client_id = @client_id; 
END

