
CREATE PROCEDURE [dbo].[afcs_consumer_qr_balance_sel]  
(  
	@hash_key NVARCHAR(MAX)
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	DECLARE @qr_id INT
	BEGIN
	    SELECT @qr_id=id FROM dbo.generated_qrs WHERE hash_key = @hash_key

		IF ISNULL(@qr_id,0) <> 0
			SELECT 
				IIF(is_active = 'Y', 'Y', 'N') AS is_valid
				, IIF(is_active = 'Y', 'QR code is valid.', 'QR code is no longer valid.') AS msg
				, IIF(is_active = 'Y', balance_amt, 0) AS current_balance
			FROM dbo.generated_qrs 
			WHERE 1 = 1 
			AND hash_key = @hash_key
       ELSE
	      SELECT 
		     'N' AS is_valid
			,'QR code is not valid.' AS msg
			,'0' AS current_balance
	END
END;