
CREATE procedure [dbo].[loads_report_sel]
( 
  @user_id int = null
 ,@load_date_frm nvarchar(50) = null
 ,@load_date_to nvarchar(50) = null
 ,@load_by nvarchar(20) = null
 ,@date_type nvarchar(10) = null
)
AS
BEGIN
SET NOCOUNT ON
  --DECLARE @co_code nvarchar(20)=null
  DECLARE @stmt nvarchar(max)='';
  --select @co_code = company_code FROM dbo.users where user_id=@user_id;

  SET @stmt = 'SELECT * FROM dbo.loading_v WHERE 1=1'
	
	IF isnull(@load_by,0) <>0
	  SET @stmt = @stmt + ' AND load_by = '''+@load_by+'''';

	IF @date_type = 'yearly'
	BEGIN
		IF ISNULL(@load_date_frm,'') <> '' AND ISNULL(@load_date_to,'') <> ''
			SET @stmt = @stmt + ' AND  YEAR(load_date) BETWEEN '''+@load_date_frm+''' AND '''+@load_date_to+''''  ;
	END

	ELSE
	BEGIN
		IF ISNULL(@load_date_frm,'') <> '' AND ISNULL(@load_date_to,'') <> ''
			SET @stmt = @stmt + ' AND  MONTH(load_date) BETWEEN '''+@load_date_frm+''' AND '''+@load_date_to+''''  ;
	END

	--ELSE
	--BEGIN
	--	IF ISNULL(@@load_date_frm,'') <> '' AND ISNULL(@@load_date_to,'') <> ''
	--		SET @stmt = @stmt + ' AND  WEEK(load_date) BETWEEN '''+@@load_date_frm+''' AND '''+@@load_date_to+''''  ;
	--END
	
  EXEC(@stmt);
  
END;
