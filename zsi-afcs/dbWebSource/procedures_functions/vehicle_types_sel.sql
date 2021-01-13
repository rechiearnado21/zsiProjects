CREATE PROCEDURE [dbo].[vehicle_types_sel]
(
   @user_id  int = null
  ,@vehicle_type_id  INT = null
)
AS
BEGIN
      SELECT fare_id vehicle_type_id, vehicle_type FROM dbo.fare_matrix WHERE 1=1; 
END


