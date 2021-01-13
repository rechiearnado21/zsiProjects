CREATE PROCEDURE [dbo].[users_sel]  
(  
   @user_id int = NULL
  ,@search_user_id int = NULL
  ,@logon nvarchar(50) = NULL
  ,@searchOption VARCHAR(50) = NULL
  ,@searchValue VARCHAR(50) = NULL
  ,@role_id INT = NULL
  ,@client_id INT = NULL
  ,@is_active VARCHAR(1)='Y'
  ,@is_contact varchar(1)='N'
  ,@col_no INT = 3
  ,@order_no INT = 0
  ,@pno INT = 1
  ,@rpp INT = 1000
)  
AS  
BEGIN  
SET NOCOUNT ON
DECLARE @stmt           VARCHAR(4000);
DECLARE @order          VARCHAR(4000);
DECLARE @count INT = 0;
DECLARE @page_count INT = 1;
DECLARE @is_dev  char(1) = null

SET @stmt = 'SELECT user_id, userFullName, logon, first_name, middle_name, last_name, name_suffix, password,  is_admin, role_id, is_developer, company_id, has_img, hash_key, bank_id,is_hcm,is_fmis,is_afcs  FROM users_v WHERE is_active = ''' + CAST(@is_active AS VARCHAR(1)) + '''';  
   SET @order = ' ORDER BY ' + CAST(@col_no + 1 AS VARCHAR(1)) + ' ' + IIF(@order_no=0,'ASC','DESC');  
   SELECT @count = COUNT(*) FROM dbo.users_v WHERE is_active = @is_active;

IF ISNULL(@client_id,0) <>0
BEGIN
     SET @stmt = @stmt + ' AND company_id = ' + CAST(@client_id AS VARCHAR(20));
     SELECT @count = COUNT(*) FROM dbo.users_v where company_id = @client_id;
END

IF ISNULL(@search_user_id,0) <>0
BEGIN
     SET @stmt = @stmt + ' AND user_id = ' + CAST(@search_user_id AS VARCHAR(20));
     SET @count = 1;
END


IF ISNULL(@logon,'') <>''  
   SET @stmt = @stmt + ' AND logon = ''' + @logon + '''';  


IF ISNULL(@searchValue,'') <>''
BEGIN
     SET @stmt = @stmt + ' AND ' +  @searchOption + ' Like ''' + @searchValue + '%''';
 SELECT @count = COUNT(*) FROM dbo.users_v WHERE is_active = @is_active + ' AND ' +  @searchOption + ' Like ''' + @searchValue + '%''';  
END

 IF ISNULL(@role_id,0) <>0
BEGIN
     SET @stmt = @stmt + ' AND role_id=' +  CAST(@role_id AS VARCHAR(20))
     SELECT @count = COUNT(*) FROM dbo.users_v WHERE is_active = @is_active + ' AND  role_id =' + CAST(@role_id AS VARCHAR(20));
END

SET @stmt = @stmt + @order
SET @stmt = @stmt + ' OFFSET (' + CAST(@pno-1 AS VARCHAR(20)) +')*' + CAST(@rpp AS VARCHAR(20)) + ' ROWS FETCH NEXT ' + CAST(@rpp AS VARCHAR(20)) + ' ROWS ONLY ';
EXEC(@stmt);

SET @page_count =  CEILING((CONVERT(DECIMAL(20,5),@count))/@rpp);
print 'rpp:' +  CAST(@page_count AS VARCHAR(20))
RETURN @page_count;
END;