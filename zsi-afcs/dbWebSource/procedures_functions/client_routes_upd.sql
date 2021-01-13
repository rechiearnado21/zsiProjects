CREATE PROCEDURE [dbo].[client_routes_upd]
(
    @tt    client_routes_tt READONLY
   ,@user_id INT
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	      client_id			= b.client_id		
			 ,route_id			= b.route_id	
			 ,updated_by		= @user_id
			 ,updated_date		= DATEADD(HOUR, 8, GETUTCDATE())
       FROM dbo.client_routes a INNER JOIN @tt b
	     ON a.client_route_id = b.client_route_id
	     WHERE (
			isnull(b.is_edited,'N') = 'Y'
		);
-- Insert Process
	INSERT INTO client_routes (
		 client_id					
	    ,route_id	
		,created_by
		,created_date
    )
	SELECT 
         client_id
		,route_id
		,@user_id
		, DATEADD(HOUR, 8, GETUTCDATE())
	FROM @tt 
	WHERE client_route_id IS NULL
	AND route_id IS NOT NULL

