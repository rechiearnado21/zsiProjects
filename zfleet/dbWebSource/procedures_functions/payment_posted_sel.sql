
CREATE procedure [dbo].[payment_posted_sel]
( 
  @user_id int = null
 ,@posted_frm nvarchar(50) = null
 ,@posted_to nvarchar(50) = null
 ,@vehicle_id int = null
 ,@payment_type nvarchar(20) = null
 ,@pao_id nvarchar(20) = null
 ,@driver_id nvarchar(20) = null
 ,@route_id nvarchar(50) = null
)
AS
BEGIN
SET NOCOUNT ON
  DECLARE @co_code nvarchar(20)=null
  DECLARE @stmt nvarchar(max)='';
  select @co_code = company_code FROM dbo.users where user_id=@user_id;

  SET @stmt = 'SELECT * FROM dbo.payments_posted_v  WHERE company_code=''' + @co_code + ''''
	IF ISNULL(@vehicle_id,0) <> 0
		SET @stmt = @stmt + ' AND vehicle_id = ' + CAST(@vehicle_id AS VARCHAR(20));
	IF ISNULL(@payment_type,'') <>''
	  SET @stmt = @stmt + ' AND payment_type = '''+@payment_type+'''';

	IF isnull(@pao_id,0) <>0
	  SET @stmt = @stmt + ' AND pao_id = '''+@pao_id+'''';

	IF isnull(@route_id,0) <>0
	  SET @stmt = @stmt + ' AND route_id = '''+@route_id+'''';
  
	IF isnull(@driver_id,0) <>0
	  SET @stmt = @stmt + ' AND driver_id = '''+@driver_id+'''';

	IF ISNULL(@posted_frm,'') <> '' AND ISNULL(@posted_to,'') <> ''
	  SET @stmt = @stmt + ' AND  CAST(posted_date AS DATE) BETWEEN '''+@posted_frm+''' AND '''+@posted_to+''''  ;

  EXEC(@stmt);
  
END;

