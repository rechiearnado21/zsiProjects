
CREATE PROCEDURE [dbo].[zload_merchant_info_sel]  
(  
   @user_id INT = NULL
   , @hash_key NVARCHAR(MAX)
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @client_id INT;
	DECLARE @client_name NVARCHAR(50);
	DECLARE @balance_amount DECIMAL(12, 2);
	DECLARE @allow_negative NCHAR(1);

	SELECT 
		@client_id = client_id 
		, @client_name = client_name
		, @balance_amount = balance_amount
		, @allow_negative = ISNULL(allow_negative, 'N')
	FROM zsi_crm.dbo.clients
	WHERE 1 = 1
	AND hash_key = @hash_key;

	IF @client_id IS NOT NULL
	BEGIN
		SELECT 
			'Y' AS is_valid
			, 'Success' AS msg
			, @client_name AS client_name
			, @balance_amount AS balance_amount
			, @hash_key AS hash_key
			, @allow_negative AS allow_negative
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 'Error' AS msg
			, '' AS client_name
			, 0 AS balance_amount
			, '' AS hash_key
			, @allow_negative AS allow_negative
	END
END;