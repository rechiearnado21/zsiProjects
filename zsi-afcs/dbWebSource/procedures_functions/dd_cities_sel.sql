

CREATE PROCEDURE [dbo].[dd_cities_sel]
(
    @user_id  int = null
   ,@state_id int = null
)
AS
BEGIN
      SELECT city_id, city_name FROM dbo.cities WHERE state_id = @state_id; 
END



