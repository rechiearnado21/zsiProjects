CREATE procedure [dbo].[for_bank_transfer_sel]
( 
  @user_id int = null 
  ,@posted_date nvarchar(50)=null 
)
AS
BEGIN
SET NOCOUNT ON
  DECLARE @co_code nvarchar(20)=null
  DECLARE @stmt nvarchar(max)='';
  select @co_code = company_code FROM dbo.users where user_id=@user_id;

  SET @stmt = 'SELECT * FROM dbo.for_bank_transfer_v  where company_code=''' + @co_code + '''' 

   IF isnull(@posted_date,'') <>''
	  SET @stmt = @stmt + ' AND cast(posted_date as date) = '''+@posted_date+''''; 
  EXEC(@stmt);
  
END;

