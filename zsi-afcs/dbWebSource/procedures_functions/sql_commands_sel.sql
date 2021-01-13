
CREATE PROCEDURE [dbo].[sql_commands_sel](
  @user_id INT=null
 ,@sort_index INT=1
 ,@sort_order INT=0
 ,@rpp        INT=25
 ,@pno        INT=1
 ,@searchCode VARCHAR(50) = null
 ,@searchText VARCHAR(50) = null
)

AS
BEGIN

	SET NOCOUNT ON
	DECLARE @stmt         NVARCHAR(MAX)
	DECLARE @order        NVARCHAR(20) = ' ASC'
	DECLARE @stmt2        NVARCHAR(MAX)
	DECLARE @count		  INT = 0
	DECLARE @result_param NVARCHAR(500)
	DECLARE @page_count	  INT = 1

	IF @sort_order = 1
	   SET @order = ' DESC'

	SET @stmt = 'SELECT * FROM dbo.sql_commands WHERE 1=1 ';
	SET @stmt2 = N'SELECT @result = COUNT(*) FROM dbo.sql_commands  WHERE 1=1 ';
	SET @result_param = N'@result varchar(30) OUTPUT';

	IF isnull(@searchCode,'') <>'' 
	BEGIN
			SET @stmt = @stmt + ' AND sqlcmd_code like ''%'+@searchCode+'%''';
			SET @stmt2 = @stmt2 + ' AND sqlcmd_code like ''%'+@searchCode+'%''';
	END
	
	IF isnull(@searchText,'') <>''
	BEGIN
			SET @stmt = @stmt + ' AND sqlcmd_text like ''%'+@searchText+'%''';
			SET @stmt2 = @stmt2 + ' AND sqlcmd_text like ''%'+@searchText+'%''';
	END	

	EXECUTE sp_executesql @stmt2, @result_param, @result=@Count OUTPUT;

	SET @stmt = @stmt +  ' ORDER BY ' + cast(@sort_index as varchar(20)) + @order;
	SET @stmt = @stmt + ' OFFSET (' + CAST(@pno-1 AS VARCHAR(20)) +')*' + CAST(@rpp AS VARCHAR(20)) + ' ROWS FETCH NEXT ' + CAST(@rpp AS VARCHAR(20)) + ' ROWS ONLY '; 
	 
	EXEC(@stmt);

	SET @page_count =  CEILING((CONVERT(DECIMAL(20,5),@count))/@rpp);
	print 'if page_count:'
	print IIF(isnull(@page_count,0)=0,1,@page_count);
	 
	RETURN IIF(isnull(@page_count,0)=0,1,@page_count);
END

 
