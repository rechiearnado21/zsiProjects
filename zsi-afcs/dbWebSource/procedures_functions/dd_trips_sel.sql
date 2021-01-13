

CREATE PROCEDURE [dbo].[dd_trips_sel]
(
    @user_id  int = null 
   ,@client_id int
)  
AS
BEGIN
  DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = CONCAT('SELECT DISTINCT trip_id, trip_no FROM dbo.vehicle_trips_',@client_id,'  WHERE 1 = 1'); 
  EXEC(@stmt);
END
 
