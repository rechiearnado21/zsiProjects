


CREATE PROCEDURE [dbo].[afcs_barangays_sel]  
(  
	@city_id INT
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	SELECT barangay_id, barangay_name FROM dbo.city_barangays WHERE 1 = 1 AND city_id = @city_id ORDER BY barangay_name;
END;