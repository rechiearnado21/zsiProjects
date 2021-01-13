create PROCEDURE [dbo].[route_details_map_upd]
(
    @tt    map_data_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET  map_area = geometry::STPolyFromText(b.map_area,0)
			
     FROM dbo.route_details a INNER JOIN @tt b
        ON a.location = b.name
 END