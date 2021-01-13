CREATE PROCEDURE [dbo].[passenger_travel_history_sel](
  @last_name   nvarchar(20)=null
 ,@first_name  nvarchar(20)=null
 ,@travel_date nvarchar(20)=null 
 ,@user_id INT=null 
)
AS
BEGIN
 SET NOCOUNT ON
 DECLARE @stmt nvarchar(max)
 SET @stmt = 'SELECT * FROM dbo.travel_history_v WHERE 1=1 '
 
 IF ISNULL(@last_name,'')<>''
    SET @stmt = @stmt + ' AND last_name like ''%' + @last_name + '%'''

 IF ISNULL(@first_name,'')<>''
    SET @stmt = @stmt + ' AND first_name like ''%' + @first_name + '%'''

 IF ISNULL(@travel_date,'')<>''
    SET @stmt = @stmt + ' AND cast(payment_date as date) = '''+ @travel_date +''''; 

EXEC(@stmt);
END