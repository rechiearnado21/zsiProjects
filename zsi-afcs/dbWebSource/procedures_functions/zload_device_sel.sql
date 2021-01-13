
CREATE PROCEDURE [dbo].[zload_device_sel]  
(  
   @user_id INT = NULL
   , @device_hash_key NVARCHAR(MAX)
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @device_id INT;
	DECLARE @is_active NCHAR(1);
	DECLARE @hash_key NVARCHAR(MAX);
	DECLARE @name NVARCHAR(50);

	SELECT 
		@device_id = device_id 
		, @is_active = is_active
		, @hash_key = hash_key
		, @name = [name]
	FROM zsi_load.dbo.devices
	WHERE 1 = 1
	AND hash_key = @device_hash_key;

	IF @device_id IS NOT NULL
	BEGIN
		SELECT 
			'Y' AS is_valid
			, 'Success' AS msg
			, @is_active AS is_active
			, @hash_key AS device_hash_key
			, @name AS device_name
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 'Error' AS msg
			, '' AS is_active
			, '' AS device_hash_key
			, '' AS device_name
	END
END;