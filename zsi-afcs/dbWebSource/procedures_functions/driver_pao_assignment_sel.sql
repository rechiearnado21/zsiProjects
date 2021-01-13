
CREATE PROCEDURE [dbo].[driver_pao_assignment_sel]
(
   @user_id  INT
  ,@vehicle_id INT = NULL
  ,@client_id INT = NULL
)
AS
BEGIN
	SET NOCOUNT ON
		DECLARE @stmt		VARCHAR(4000); 

		SET @stmt = 'SELECT * FROM dbo.driver_pao_assignment WHERE assignment_date >= CAST( DATEADD(HOUR,8,GETUTCDATE()) AS DATE )';

		IF ISNULL(@vehicle_id,0) <> 0
			SET @stmt = @stmt + ' AND vehicle_id='+ CAST(@vehicle_id AS VARCHAR(20));

		IF ISNULL(@vehicle_id,0) <> 0
			SET @stmt = @stmt + ' AND client_id='+ CAST(@client_id AS VARCHAR(20));

		SET @stmt = @stmt + ' ORDER by driver_pao_assignment_id';
    exec(@stmt);
END



--[dbo].[driver_pao_assignment_sel] @vehicle_id=1,@user_id=2,@client_id=1