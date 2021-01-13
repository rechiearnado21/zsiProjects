
CREATE procedure [dbo].[bank_payments_posted_sel]
( 
  @vehicle_id int = null
 ,@user_id int = null
 ,@posted_frm nvarchar(50) = null
 ,@posted_to nvarchar(50) = null
 ,@payment_type nvarchar(20) = null
 ,@company_code nvarchar(50) = null
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)='';
  SET @stmt = 'SELECT * FROM dbo.payments_posted_v where 1=1'
  IF ISNULL(@vehicle_id,0) <> 0
     SET @stmt = @stmt + ' AND vehicle_id = ' + CAST(@vehicle_id AS VARCHAR(20));

  IF isnull(@payment_type,'') <>''
	  SET @stmt = @stmt + ' AND payment_type = '''+@payment_type+'''';
  
  IF isnull(@company_code,'') <>''
	  SET @stmt = @stmt + ' AND company_code = '''+@company_code+'''';
  
  IF ISNULL(@posted_frm,'') <> '' AND ISNULL(@posted_to,'') <> ''
	  SET @stmt = @stmt + ' AND  CAST(posted_date AS DATE) BETWEEN '''+@posted_frm+''' AND '''+@posted_to+''''  ;

  EXEC(@stmt);
END

--select * from payments_for_posting_v


