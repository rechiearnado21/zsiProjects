
CREATE procedure [dbo].[recent_loading_summ_sel]
( 
  @client_id  int  
 ,@user_id    int = null
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt VARCHAR(MAX)
  DECLARE @loading_tbl nvarchar(20);  
  SET @loading_tbl = CONCAT('dbo.loading_',@client_id); 

  SET @stmt = CONCAT('SELECT total_load,load_by,loading_branch_id, load_date FROM (
                  SELECT sum(load_amount) total_load, load_by,loading_branch_id,convert(date,load_date) loading_date 
				  FROM ', @loading_tbl, ' 
				  GROUP BY total_load,load_by,loading_branch_id, convert(date,load_date) 
				  ) x ');  
				  
  PRINT (@stmt)
  EXEC(@stmt);
END