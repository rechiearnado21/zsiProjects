
CREATE PROCEDURE [dbo].[route_nos_upd]
(
    @tt    route_nos_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	      route_id			= b.route_id		
			 ,route_no			= b.route_no
			 ,route_name		= b.route_name	
			 ,updated_by		= @user_id
			 ,updated_date		= DATEADD(HOUR, 8, GETUTCDATE())
			 
       FROM dbo.route_nos a INNER JOIN @tt b
	     ON a.route_no_id = b.route_no_id
	     WHERE (
			isnull(b.is_edited,'N') = 'Y'
		);
-- Insert Process
	INSERT INTO route_nos (
		 route_id					
	    ,route_no	
		,route_name
		,created_by
		,created_date
    )
	SELECT 
         route_id
		,route_no
		,route_name
		,@user_id
		,DATEADD(HOUR, 8, GETUTCDATE())

	FROM @tt 
	WHERE route_no_id IS NULL
	AND route_id IS NOT NULL
	AND route_no IS NOT NULL
	AND route_name IS NOT NULL


