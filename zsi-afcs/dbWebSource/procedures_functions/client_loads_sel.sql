
CREATE procedure [dbo].[client_loads_sel]( 
  @user_id INT = null
)
as
BEGIN
	DECLARE @stmt		VARCHAR(4000);
		SET @stmt = 'SELECT * FROM dbo.client_loads WHERE 1=1 '; 
	exec(@stmt);
END;
