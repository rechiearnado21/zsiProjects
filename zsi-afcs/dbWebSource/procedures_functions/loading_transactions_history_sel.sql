
CREATE procedure [dbo].[loading_transactions_history_sel]
( 
  @client_id  int  
 ,@pdate_from varchar(10)=null
 ,@pdate_to   varchar(10)=null
 ,@user_id    int = null 
)
AS
BEGIN
SET NOCOUNT ON 
  DECLARE @stmt nvarchar(max)=''; 
  DECLARE @loadingtbl nvarchar(50);   
  SET @loadingtbl = CONCAT('zsi_load.dbo.loading_',@client_id) 

  SET @stmt = CONCAT('SELECT load_amount, load_by, FORMAT(load_date, ''MM-dd-yyyy hh:mm:ss tt'') as loading_date  
					FROM ', @loadingtbl, '  WHERE CONVERT(DATE,load_date,101) between ''',@pdate_from,''' AND ''',@pdate_to,'''') 
  PRINT(@stmt);
  EXEC(@stmt);
  
END;

