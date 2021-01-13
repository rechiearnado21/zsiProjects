
CREATE PROCEDURE [dbo].[zload_consumer_inquiry_sel]  
(  
   @hash_key NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @generated_qrs_id INT;

	-- Check whether the hash_key exists in the generated_qrs table and is active.
	SELECT @generated_qrs_id = [id] FROM dbo.generated_qrs WHERE 1 = 1 AND is_active = 'Y' AND hash_key = @hash_key;
	
	SELECT
		b.first_name
		, ISNULL(b.middle_name, '') AS middle_name
		, b.last_name
		, b.is_active
		, ISNULL(a.balance_amt, 0) AS credit_amount
		, ISNULL(a.hash_key, '') AS hash_key1
		, ISNULL(a.hash_key2, '') AS hash_key2
		--, ISNULL(b.image_filename, '') AS image_filename
		, CAST('' as xml).value('xs:base64Binary(sql:column("image_filename"))', 'varchar(max)') AS image_filename
	FROM dbo.generated_qrs a
	LEFT JOIN dbo.consumers b
	ON a.consumer_id = b.consumer_id
	WHERE 1 = 1
	AND a.id = @generated_qrs_id;
END;