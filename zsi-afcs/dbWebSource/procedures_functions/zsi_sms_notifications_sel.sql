
CREATE PROCEDURE [dbo].[zsi_sms_notifications_sel]  
(  
   @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	CREATE TABLE #tbl (
       [sms_notification_id] int
	 , [mobile_no] nvarchar(12)
	 , [message] nvarchar(max)
	 )

	INSERT INTO #tbl SELECT TOP 5
       [sms_notification_id] 
	 , [mobile_no] 
	 , [message]
	FROM [dbo].[sms_notifications]
	WHERE 1= 1
	AND [app_name] IN ('zpay','zload')
	AND [is_processed] = 'N'

	SELECT
       [sms_notification_id] 
	 , [mobile_no] 
	 , [message]
	 FROM #tbl

   UPDATE a SET is_processed = 'Y' 
      FROM [dbo].[sms_notifications] a, #tbl b
	  WHERE a.sms_notification_id = b.sms_notification_id;
DROP TABLE #tbl;
END;

