


CREATE PROCEDURE [dbo].[afcs_cities_sel]  
(  
	@state_id INT
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	SELECT city_id, city_name FROM dbo.cities WHERE 1 = 1 AND state_id = @state_id ORDER BY city_name;
END;