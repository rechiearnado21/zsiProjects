

CREATE PROCEDURE [dbo].[afcs_pay_merchant_sel]  
(  
	@merchant_hash_key NVARCHAR(MAX)
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @client_id INT;
	BEGIN
		SELECT @client_id = client_id FROM dbo.clients_v WHERE 1 = 1 AND hash_key = @merchant_hash_key;

		IF @client_id IS NOT NULL
			SELECT 
				'Y' AS is_valid
				, 'The scanned QR is a valid merchant.' AS msg
		ELSE
			SELECT 
				'N' AS is_valid
				, 'Sorry, the scanned QR is not a valid merchant.' AS msg
	END
END;