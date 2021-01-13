CREATE procedure [dbo].[loading_collection_sel]
( 
  @client_id int  
 ,@user_id int=NULL

)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)=''; 
  DECLARE @loading_tbl nvarchar(20);
  SET @loading_tbl = CONCAT('dbo.loading_',@client_id); 


  SET @stmt = CONCAT('SELECT (load_date) load_day, SUM(load_amount) load_amount FROM ',@loading_tbl, 
                     ' where consumer_id = ',@client_id,'',
					 ' GROUP BY load_date'); 

EXEC(@stmt);

END