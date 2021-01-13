
CREATE PROCEDURE [dbo].[afcs_consumer_upd]  
(  

	@consumer_hash_key NVARCHAR(MAX)
	, @username NVARCHAR(20)
	, @email NVARCHAR(300)
	, @first_name NVARCHAR(300)
	, @middle_name NVARCHAR(300)
	, @last_name NVARCHAR(300)
	, @address NVARCHAR(300)
	, @birthdate DATE
	, @image NVARCHAR(MAX)
	, @gender NCHAR(1)
	, @state_id INT
	, @city_id INT
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @consumer_id INT;

	SELECT @consumer_id = consumer_id FROM dbo.consumers WHERE 1 = 1 AND hash_key = @consumer_hash_key;

	IF @consumer_id IS NOT NULL
	BEGIN
		BEGIN TRAN;

      

		UPDATE 
			dbo.consumers
		SET
			mobile_no = @username
			, email = @email
			, first_name = @first_name
			, middle_name = @middle_name
			, last_name = @last_name
			, [address] = @address
			, birthdate = @birthdate
			, image_filename = CAST(N'' AS xml).value('xs:base64Binary(sql:variable("@image"))', 'varbinary(max)')
			, gender = @gender
			, state_id = @state_id
			, city_id = @city_id
		WHERE 1 = 1
		AND consumer_id = @consumer_id;

		IF @@ERROR = 0
		BEGIN
			COMMIT;
		
			SELECT
				'Y' AS is_valid
				, 'Success' AS msg
				, a.mobile_no
				, a.email
				, a.first_name
				, ISNULL(a.middle_name, '') AS middle_name
				, a.last_name
				, ISNULL(a.[address], '') AS [address]
				, a.is_active
				, b.hash_key
				, ISNULL(a.birthdate, '') AS birthdate
				, ISNULL(a.gender, '') AS gender
				, state_id AS state_id
				, city_id  AS city_id
			FROM dbo.consumers a
			LEFT JOIN dbo.generated_qrs b
			ON a.consumer_id = b.consumer_id
			WHERE 1 = 1
			AND b.is_active = 'Y'
			AND a.consumer_id = @consumer_id;
		END
		ELSE
		BEGIN
			ROLLBACK;

			SELECT
				'N' AS is_valid
				, 'Failed' AS msg
				, a.mobile_no
				, a.email
				, a.first_name
				, ISNULL(a.middle_name, '') AS middle_name
				, a.last_name
				, ISNULL(a.[address], '') AS [address]
				, a.is_active
				, b.hash_key
				, ISNULL(a.birthdate, '') AS birthdate
				, ISNULL(a.gender, '') AS gender
				, state_id AS state_id
				, city_id  AS city_id
			FROM dbo.consumers a
			LEFT JOIN dbo.generated_qrs b
			ON a.consumer_id = b.consumer_id
			WHERE 1 = 1
			AND b.is_active = 'Y'
			AND a.consumer_id = @consumer_id;
		END
	END
END;