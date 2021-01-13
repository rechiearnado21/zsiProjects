

CREATE PROCEDURE [dbo].[afcs_qr_code_sel]  
(  
   @hash_key1		NVARCHAR(MAX)
   , @hash_key2		NVARCHAR(MAX)
   , @user_id		INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @id INT;
	DECLARE @amount DECIMAL(12, 2);

	SELECT
		@id = id
	FROM dbo.generated_qrs_active_v
	WHERE hash_key = @hash_key1
	AND hash_key2 = @hash_key2;

	IF @id IS NOT NULL
	BEGIN
		SELECT
			'Y' AS is_valid
			, ISNULL(balance_amt, 0)  AS amount
			, 'OK' AS msg
		FROM dbo.generated_qrs_active_v
		WHERE 1 = 1
		AND id = @id;
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 0  AS amount
			, 'QR code is invalid.' AS msg
	END
END;