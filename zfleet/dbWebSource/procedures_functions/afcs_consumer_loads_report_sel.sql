
CREATE PROCEDURE [dbo].[afcs_consumer_loads_report_sel]  
(  
   @username NVARCHAR(300)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	SELECT 
		a.load_date
		, a.load_amount
	FROM dbo.loading a
	JOIN dbo.generated_qrs b
	ON a.qr_id = b.id
	JOIN dbo.consumers c
	ON b.consumer_id = c.consumer_id
	WHERE 1 = 1
	AND c.email = @username
	ORDER BY
		a.load_date DESC
END;