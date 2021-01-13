
CREATE PROCEDURE [dbo].[dd_route_no_sel]
(
    @user_id  int = null
   ,@route_id int = null
)
AS
BEGIN
      SELECT route_no, CONCAT(route_no,' » ', route_name) route FROM dbo.route_nos WHERE route_id = @route_id ORDER BY route_no; 
END

