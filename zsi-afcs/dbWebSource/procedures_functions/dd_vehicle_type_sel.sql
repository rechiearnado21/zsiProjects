


CREATE PROCEDURE [dbo].[dd_vehicle_type_sel]
(
   @user_id  int = null
)
AS
BEGIN
      SELECT * FROM dbo.fare_matrix; 
END



