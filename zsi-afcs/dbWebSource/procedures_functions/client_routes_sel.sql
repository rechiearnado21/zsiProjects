CREATE PROCEDURE [dbo].[client_routes_sel]  
(  
   @user_id  int = null  
  ,@route_id  INT = null  
)  
AS  
BEGIN 
      SELECT * FROM dbo.client_routes WHERE 1=1; 
END 