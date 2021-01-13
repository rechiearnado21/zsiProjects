CREATE PROCEDURE [dbo].[zViewImageByTableCode_sel]
(
	  @table_code   VARCHAR(50)
     ,@column_name  VARCHAR(50)
     ,@search_value	VARCHAR(50)
	 --,@user_id int
	
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt							VARCHAR(max); 
  DECLARE @table_name					VARCHAR(50);
  DECLARE @pkey_name					VARCHAR(50);

  SELECT @table_name=table_name  from tables WHERE table_code = @table_code; 
  SET @stmt = 'SELECT * FROM ' +  @table_name + ' WHERE ' + @column_name + '=''' + @search_value + '''' 
  print(@stmt);
  exec(@stmt);
  RETURN @@ROWCOUNT;
 END;
