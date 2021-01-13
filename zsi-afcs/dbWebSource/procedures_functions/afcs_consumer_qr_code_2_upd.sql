

CREATE PROCEDURE [dbo].[afcs_consumer_qr_code_2_upd]  
(  
   @username NVARCHAR(100)
   , @reason NVARCHAR(100)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @consumer_id INT;

	SELECT @consumer_id = consumer_id FROM dbo.consumers WHERE 1 = 1 AND mobile_no = @username;

	IF @consumer_id IS NOT NULL
	BEGIN
		BEGIN TRAN;
		INSERT INTO dbo.consumer_change_qr_code2_request(
			[consumer_id]
			, [reason]
			, [created_by]
			, [created_date]
		) VALUES (
			@consumer_id
			, @reason
			, @user_id
			, DATEADD(HOUR, 8, GETUTCDATE())
		)

		IF @@ERROR = 0
		BEGIN
			COMMIT;
			SELECT 
				'Y' is_valid
				, 'Your request is now logged and will be processed within 24 hours.' AS msg
		END
		ELSE
		BEGIN
			ROLLBACK;
			SELECT 
				'N' is_valid
				, 'An error occurred while processing the request.' AS msg
		END
	END
	ELSE
	BEGIN
		SELECT 
			'N' is_valid
			, 'User not found.' AS msg
	END
END;