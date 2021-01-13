CREATE PROCEDURE [dbo].[select_options_del_test]
(
      @ids     VARCHAR(max)
	 ,@user_id int
	 ,@client_id int
	
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt							VARCHAR(max); 
  
 
  SET @stmt = 'DELETE FROM select_options WHERE select_id IN (' + REPLACE(@ids,'/',',') + ')' 
  print(@stmt);
  exec(@stmt);
  RETURN @@ROWCOUNT;
 END;

