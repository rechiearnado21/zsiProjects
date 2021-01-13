

CREATE PROCEDURE [dbo].[afcs_legacy_scan_qr_balance_sel]  
(  
	@device_hash_key NVARCHAR(MAX)
	, @hash_key NVARCHAR(MAX)
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @device_id INT = 0;

	SELECT @device_id = device_id
		FROM dbo.devices WHERE 1 = 1
		AND hash_key = @device_hash_key
		AND is_active = 'Y'

	IF @device_id > 0
	BEGIN
		SELECT 
			IIF(is_active = 'Y', 'Y', 'N') AS is_valid
			, IIF(is_active = 'Y', 'QR Code is valid.', 'QR Code is not active.') AS msg
			, IIF(is_active = 'Y', balance_amt, 0) AS current_balance
		FROM dbo.generated_qrs WHERE 1 = 1 
		AND hash_key = @hash_key
	END
	ELSE
	BEGIN
		SELECT 
			'N' AS is_valid
			, 'Device is not registered to process this transaction.' AS msg
			, 0 AS current_balance
	END
END;
