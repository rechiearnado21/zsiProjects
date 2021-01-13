CREATE PROCEDURE [dbo].[pao_sel]
(
    @user_id  int = null
   ,@client_id int 
   ,@is_active varchar(1)='Y'
   ,@pno INT = 1
   ,@rpp INT = 1000
   ,@col_no INT = 1
   ,@order_no INT = 0
   ,@searchVal VARCHAR(50) = null
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @pao_tbl NVARCHAR(100);
	DECLARE @orderby NVARCHAR(5);
	SET @pao_tbl = CONCAT('zsi_hcm.dbo.employees_',@client_id,'_v')
	SET @orderby = IIF(@order_no = 0,' ASC', 'DESC')
	
	DECLARE @stmt nvarchar(max)='';
		SET @stmt = 'SELECT * FROM ' + @pao_tbl + ' WHERE is_pao=''Y''';
	
	IF isnull(@is_active,'') <>''
		SET @stmt = @stmt + ' AND is_active='''+@is_active+'''';

	IF isnull(@searchVal,'') <>''
	   SET @stmt = @stmt + ' AND first_name like ''%'+@searchVal+'%'' or last_name like ''%'+@searchVal+'%''';
	
	SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no as varchar(20));
  
	IF isnull(@order_no,0) <> 0
	   SET @stmt = @stmt + ' DESC'
     ELSE
	   SET @stmt = @stmt + ' ASC'
	EXEC(@stmt);
END


 --[dbo].[pao_sel] @client_id=1
