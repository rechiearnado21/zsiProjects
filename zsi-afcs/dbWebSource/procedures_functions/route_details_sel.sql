CREATE PROCEDURE [dbo].[route_details_sel]
(
   @user_id  INT = null
  ,@route_id INT = null
  ,@route_no INT = null
  ,@route_detail_id  INT = null
)
AS
BEGIN
	SET NOCOUNT ON
		DECLARE @stmt		VARCHAR(4000); 

		SET @stmt = 'SELECT route_detail_id,route_id,route_no,location,distance_km,seq_no,map_area.ToString() as map_area FROM dbo.route_details WHERE 1=1';

		IF ISNULL(@route_id,0) <> 0
			SET @stmt = @stmt + ' AND route_id='+ CAST(@route_id AS VARCHAR(20));

		IF ISNULL(@route_no,0) <> 0
			SET @stmt = @stmt + ' AND route_no='+ CAST(@route_no AS VARCHAR(20));

		SET @stmt = @stmt + 'ORDER by route_no, seq_no ';
    exec(@stmt);
END



