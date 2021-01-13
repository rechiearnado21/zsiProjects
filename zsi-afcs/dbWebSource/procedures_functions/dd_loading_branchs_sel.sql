

CREATE PROCEDURE [dbo].[dd_loading_branchs_sel]
(
    @user_id  int = null
   ,@is_active varchar(1)='Y'
)
AS
BEGIN
    SET NOCOUNT ON
	DECLARE @company_id nvarchar(20)=null
	DECLARE @stmt nvarchar(max)='';
		select @company_id = company_id FROM dbo.users where user_id=@user_id;
		SET @stmt = 'SELECT loading_branch_id, store_code FROM dbo.loading_branches WHERE is_active = ''' + @is_active + '''  AND company_id = ''' + @company_id + '''';

	EXEC(@stmt);
END



