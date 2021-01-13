
CREATE PROCEDURE [dbo].[route_details_upd]
(
    @tt    route_details_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	      route_id			= b.route_id		
			 ,route_no			= b.route_no	
			 ,location			= b.location	
			 ,distance_km		= b.distance_km	
			 ,seq_no			= b.seq_no	
			 ,map_area			= b.map_area	
			 
       FROM dbo.route_details a INNER JOIN @tt b
	     ON a.route_detail_id = b.route_detail_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO route_details (
		 route_id					
	    ,route_no	
		,location
		,distance_km
		,seq_no
		,map_area
    )
	SELECT 
         route_id					
	    ,route_no	
		,location
		,distance_km
		,seq_no
		,map_area

	FROM @tt 
	WHERE route_detail_id IS NULL

	AND ISNULL(route_no,0) <> 0
	AND ISNULL(seq_no,0) <> 0
	AND ISNULL(distance_km,0) <> 0
	AND ISNULL(location,'') <> ''
