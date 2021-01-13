

CREATE PROCEDURE [dbo].[dd_country_sel]
(
   @user_id  int = null
)
AS
BEGIN
      SELECT country_id, country_name FROM dbo.countries; 
END



