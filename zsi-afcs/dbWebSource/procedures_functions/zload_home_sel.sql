
CREATE PROCEDURE [dbo].[zload_home_sel]  
(  
   @user_id INT = NULL
   , @merchant_hash_key NVARCHAR(MAX)
   , @loader_hash_key NVARCHAR(MAX)
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @client_id INT;
	DECLARE @client_name NVARCHAR(300);
	DECLARE @balance_amount DECIMAL(12, 2);
	DECLARE @loader_name NVARCHAR(300);

	SELECT 
		@client_id = client_id 
		, @client_name = client_name
		, @balance_amount = ISNULL(balance_amount, 0)
	FROM zsi_crm.dbo.clients
	WHERE hash_key = @merchant_hash_key;

	IF @client_id IS NOT NULL
	BEGIN
		SELECT
			@loader_name = CONCAT(first_name, ' ', last_name)
		FROM zsi_load.dbo.load_personnel 
		WHERE emp_hash_key = @loader_hash_key;

		SELECT 
			'Y' AS is_valid
			, 'Success' AS msg
			, @client_name AS client_name
			, @balance_amount AS balance_amount
			, @loader_name AS loader_name
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 'Error' AS msg
			, '' AS client_name
			, 0 AS balance_amount
			, '' AS loader_name
	END
END;