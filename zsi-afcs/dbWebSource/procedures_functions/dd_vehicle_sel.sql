
CREATE PROCEDURE [dbo].[dd_vehicle_sel]
(
    @user_id  int = null
   ,@company_id int 
) 
AS
BEGIN
   SELECT DISTINCT vehicle_id, vehicle_plate_no, is_active FROM zsi_fmis.[dbo].vehicles WHERE company_id = @company_id; 
END
