
CREATE PROCEDURE [dbo].[afcs_defaults_sel]  
(  
   @user_id INT = NULL
   , @hash_key NVARCHAR(50) = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @sql NVARCHAR(MAX);

	SET @sql = N'
		SELECT
			[default_id]
			, [hash_key]
			, [default_name]
			, [default_description]
			, ''Y'' AS is_valid
			, ''Success'' AS msg
		FROM dbo.defaults
		WHERE 1 = 1
	';
	
	IF @hash_key IS NOT NULL
	BEGIN
		SET @sql = @sql + ' AND hash_key = ''' + @hash_key  + ''' ';
	END

	EXEC(@sql);
END;