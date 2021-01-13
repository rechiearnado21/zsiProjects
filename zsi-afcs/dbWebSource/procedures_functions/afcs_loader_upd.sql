

CREATE PROCEDURE [dbo].[afcs_loader_upd]  
(  
   @device_hash_key NVARCHAR(MAX)
   , @amount DECIMAL(12, 2)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @device_id INT = 0;
	DECLARE @generated_qr_id INT;
	DECLARE @generated_qr NVARCHAR(50) = '';

	SELECT @device_id = device_id
		FROM dbo.devices WHERE 1 = 1
		AND hash_key = @device_hash_key
		AND is_active = 'Y'

	IF @device_id > 0
	BEGIN
		SELECT TOP 1 @generated_qr_id = id
			FROM dbo.generated_qrs WHERE 1 = 1
			AND ISNULL(balance_amt, 0) = 0
			AND is_taken = 'N'
			AND is_active = 'Y'
			AND ISNULL(is_loaded, '') <> 'Y'
			AND ISNULL(consumer_id, 0) = 0
			ORDER BY
				created_date

		IF @generated_qr_id > 0
		BEGIN
			BEGIN TRAN;

			UPDATE 
				dbo.generated_qrs
			SET
				is_taken = 'Y'
				, balance_amt = @amount
				, ref_trans = CONCAT(REPLACE(CONVERT(CHAR(10), GETDATE(), 101), '/', ''), id)
				, updated_by = @user_id
				, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
			WHERE 1 = 1
			AND id = @generated_qr_id

			INSERT INTO [dbo].[loading]
			   ([load_date]
			   ,[qr_id]
			   ,[load_amount]
			   ,[device_id]
			   ,[load_by])
			VALUES
			   (DATEADD(HOUR, 8, GETUTCDATE())
			   ,@generated_qr_id
			   ,@amount
			   ,@device_id
			   ,@user_id)

			IF @@ERROR = 0
			BEGIN
				COMMIT;
			END
			ELSE
			BEGIN
				ROLLBACK;
			END
		END
	END

	IF @@ERROR = 0
		SELECT 
			hash_key
			, ref_trans
		FROM dbo.generated_qrs WHERE 1 = 1 
		AND id = @generated_qr_id;
END;