CREATE PROCEDURE [dbo].[route_nos_sel]
(
   @user_id  int = NULL
  ,@route_id INT
)
AS
BEGIN
	SELECT * FROM dbo.route_nos WHERE route_id = @route_id ORDER BY route_no;
END



