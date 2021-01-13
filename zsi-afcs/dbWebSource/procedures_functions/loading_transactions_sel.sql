CREATE procedure [dbo].[loading_transactions_sel]
( 
  @user_id int = null
 ,@load_date_frm nvarchar(50) = null
 ,@load_date_to nvarchar(50) = null
)
AS
BEGIN
SET NOCOUNT ON
  --DECLARE @co_code nvarchar(20)=null
  DECLARE @stmt nvarchar(max)='';
  --select @co_code = company_code FROM dbo.users where user_id=@user_id;

  SET @stmt = 'SELECT * FROM dbo.loading_v WHERE 1=1'
	
	IF ISNULL(@load_date_frm,'') <> '' AND ISNULL(@load_date_to,'') <> ''
	  SET @stmt = @stmt + ' AND  CAST(load_date AS DATE) BETWEEN '''+@load_date_frm+''' AND '''+@load_date_to+''''  ;

  EXEC(@stmt);
  
END;
