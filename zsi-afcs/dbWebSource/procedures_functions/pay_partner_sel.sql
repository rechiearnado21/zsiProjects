
CREATE PROCEDURE [dbo].[pay_partner_sel]
(
    @user_id  int = null 
)
AS
BEGIN
	SET NOCOUNT ON 
	DECLARE @stmt nvarchar(max)='';
		SET @stmt = 'SELECT * FROM [dbo].[pay_partner] WHERE 1=1'; 
	EXEC(@stmt);
END
 
