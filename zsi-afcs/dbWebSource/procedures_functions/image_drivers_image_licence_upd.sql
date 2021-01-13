

CREATE PROCEDURE [dbo].[image_drivers_image_licence_upd](
       @user_id INT
      ,@driver_licence_img_filename NVARCHAR(200)

)
AS
BEGIN
SET NOCOUNT ON
update zsi_hcm.dbo.employees_1
set driver_licence_img_filename =@driver_licence_img_filename 
   where id = @user_id

END 
