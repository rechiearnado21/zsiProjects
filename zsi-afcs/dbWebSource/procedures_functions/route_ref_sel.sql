CREATE PROCEDURE [dbo].[route_ref_sel]  
(  
   @user_id  int = null  
  ,@route_id  INT = null  
)  
AS  
BEGIN 
    IF ISNULL(@route_id,0)=0
      SELECT * FROM dbo.routes_ref WHERE 1=1; 
	ELSE
	  SELECT * FROM dbo.routes_ref WHERE route_id = @route_id 
END 