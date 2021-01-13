
CREATE PROCEDURE [dbo].[zload_user_info_sel]  
(  
   @user_id INT = NULL
   , @emp_hash_key NVARCHAR(MAX)
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @loader_id INT;
	DECLARE @personnel_name NVARCHAR(100);
	DECLARE @hash_key NVARCHAR(MAX);

	SELECT 
		@loader_id = [id]
		, @personnel_name = CONCAT(first_name, ' ', last_name)
		, @hash_key = emp_hash_key
	FROM zsi_load.dbo.load_personnel
	WHERE 1 = 1
	AND is_active = 'Y'
	AND emp_hash_key = @emp_hash_key;

	IF @loader_id IS NOT NULL
	BEGIN
		SELECT 
			'Y' AS is_valid
			, 'Success' AS msg
			, @personnel_name AS personnel_name
			, @hash_key AS hash_key
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 'Error' AS msg
			, '' AS personnel_name
			, '' AS hash_key
	END
END;