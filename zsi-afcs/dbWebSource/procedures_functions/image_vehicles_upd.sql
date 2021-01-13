

CREATE PROCEDURE [dbo].[image_vehicles_upd](
       @vehicle_id INT
      ,@vehicle_img_filename NVARCHAR(200)

)
AS
BEGIN
SET NOCOUNT ON
update dbo.vehicles
set vehicle_img_filename =@vehicle_img_filename 
   where vehicle_id = @vehicle_id

END 
