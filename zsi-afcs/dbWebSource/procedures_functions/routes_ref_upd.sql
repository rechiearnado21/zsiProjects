CREATE PROCEDURE [dbo].[routes_ref_upd]
(
    @tt    routes_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	      route_code			= b.route_code		
			 ,route_desc			= b.route_desc	
			 
       FROM dbo.routes_ref a INNER JOIN @tt b
	     ON a.route_id = b.route_id
	     WHERE (
			isnull(b.is_edited,'N') = 'Y'
		);
-- Insert Process
	INSERT INTO routes_ref (
		 route_code					
	    ,route_desc	
    )
	SELECT 
         route_code
		,route_desc

	FROM @tt 
	WHERE route_id IS NULL

	return @@IDENTITY;

