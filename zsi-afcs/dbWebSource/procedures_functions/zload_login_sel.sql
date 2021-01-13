
CREATE PROCEDURE [dbo].[zload_login_sel]  
(  
   @user_id INT = NULL
   , @merchant_hash_key NVARCHAR(MAX)
   , @device_hash_key NVARCHAR(MAX)
   , @user_hash_key NVARCHAR(MAX)
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @error INT = 0;
	DECLARE @token NVARCHAR(6);
	DECLARE @client_id INT;
	DECLARE @device_id INT;
	DECLARE @msg NVARCHAR(MAX)='';

	SELECT @device_id = device_id FROM zsi_load.dbo.devices where hash_key=@device_hash_key;
	IF ISNULL(@device_id,0) =0
	   SET @msg = 'Unregistered device. Login Failed.'
    ELSE
	BEGIN
		SELECT @client_id = client_id FROM zsi_crm.dbo.clients WHERE 1 = 1 AND hash_key = @merchant_hash_key;
		IF @client_id IS NULL
		   SET @msg = 'Unregistered Merchant. Login Failed.'
		ELSE
		BEGIN
		BEGIN TRAN;
		-- Create a token
		SET @token = REPLACE(CAST(RAND() * 1000000 AS NVARCHAR(6)), '.', 0);
		-- Save the token to the devices table.
		UPDATE zsi_load.dbo.devices SET token = @token WHERE company_id = @client_id;
		IF @@ERROR = 0
		BEGIN
			COMMIT;
			SELECT
				'Y' AS is_valid
				,'Success' AS msg
				, @token AS token
				, a.client_name
				, CONCAT(b.first_name, ' ', b.last_name) AS loader_name
			FROM zsi_crm.dbo.clients a
			JOIN zsi_load.dbo.load_personnel b
			ON a.client_id = b.client_id
			WHERE 1 = 1
			AND a.is_active = 'Y'
			AND b.is_active = 'Y'
			AND a.is_zload = 'Y'
			AND a.hash_key = @merchant_hash_key
			AND b.emp_hash_key = @user_hash_key;
		END
		ELSE
		BEGIN
			ROLLBACK;
			SELECT
				'N' AS is_valid
				,'Sorry, something went wrong while processing your request. Please try again later.' AS msg
				, '' AS token
				, '' AS client_name
				, '' AS loader_name
		END
		END
	END
    IF @msg = ''
		SELECT
		'N' AS is_valid
		, @msg AS msg
		, '' AS token
		, '' AS client_name
		, '' AS loader_name
END;
