
CREATE PROCEDURE [dbo].[afcs_2_consumer_info_sel]  
(  
     @user_id INT = NULL
   , @hash_key NVARCHAR(50)
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @generated_qrs_id INT;

	-- Check whether the hash_key exists in the generated_qrs table and is active.
	SELECT @generated_qrs_id = [id] FROM dbo.generated_qrs WHERE 1 = 1 AND is_active = 'Y' AND hash_key = @hash_key;
	
	IF @generated_qrs_id IS NOT NULL
	BEGIN
		SELECT
			a.[consumer_id]
			, b.[first_name]
			, b.[last_name]
			, cast('' as xml).value('xs:base64Binary(sql:column("b.[image_filename]"))', 'varchar(max)') AS image_filename
			, a.[balance_amt] AS credit_amount
			, a.[is_active]
			, 'Y' AS is_valid
			, 'Success' AS msg
		FROM dbo.generated_qrs a
		LEFT JOIN dbo.consumers b
		ON a.consumer_id = b.consumer_id
		WHERE 1 = 1
		AND a.hash_key = @hash_key;
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 'QR code or user not found.' AS msg
	END
END;

