
CREATE PROCEDURE [dbo].[zsi_sms_notifications_upd]  
(  
	@ids NVARCHAR(100)
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @sql NVARCHAR(MAX) = '';

	SET @sql = N'
		UPDATE
			[dbo].[sms_notifications]
		SET
			[is_processed] = ''Y''
			, [updated_date] = GETDATE()
		WHERE 1 = 1
		AND [sms_notification_id] IN (' + @ids + ')';

	BEGIN TRAN;
	EXEC(@sql);

	IF @@ERROR = 0
	BEGIN
		COMMIT;
		
		SELECT
			'Y' AS is_valid
			, 'Success' AS msg
	END
	ELSE
	BEGIN
		ROLLBACK;

		SELECT
			'N' AS is_valid
			, 'Error' AS msg
	END
END;