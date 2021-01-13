 
CREATE procedure [dbo].[recent_loading_transactions_sel]
( 
  @user_id int = null
 ,@client_id int = null 
)
AS
BEGIN
SET NOCOUNT ON 
  DECLARE @stmt nvarchar(max)=''; 
  DECLARE @loadingtbl nvarchar(50);   
  SET @loadingtbl = CONCAT('zsi_load.dbo.loading_',@client_id) 

  SET @stmt = CONCAT('SELECT load_amount, load_by,FORMAT(load_date, ''MM-dd-yyyy hh:mm:ss tt'') as loading_date  
					FROM ', @loadingtbl, '  WHERE CONVERT(DATE,load_date,101)=CONVERT(DATE,DATEADD(HOUR, 8, GETUTCDATE()),101)')
	 
  PRINT(@stmt);
  EXEC(@stmt);
  
END;
--[recent_loading_transactions_sel] @client_id=1
-- select * from zsi_load.dbo.loading_1