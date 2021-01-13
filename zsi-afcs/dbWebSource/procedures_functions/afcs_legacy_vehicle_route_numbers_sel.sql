


CREATE PROCEDURE [dbo].[afcs_legacy_vehicle_route_numbers_sel]  
(  
   @route_hash_key NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	SELECT
		a.route_no_id
		, CONCAT(a.route_no, '-', a.route_name) AS route_name
	FROM dbo.route_nos a
	JOIN dbo.routes_ref b
	ON a.route_id = b.route_id
	WHERE 1 = 1
	AND b.route_hash_key = @route_hash_key
	ORDER BY
		a.route_no;
END;
