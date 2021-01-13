CREATE PROCEDURE [dbo].[vehicle_travel_history_sel](
  @vehicle_plate_no  nvarchar(20)=null
 --,@travel_date       nvarchar(20)=null 
 ,@first_name         nvarchar(30)=null 
 ,@last_name          nvarchar(30)=null 
 ,@time_start        nvarchar(30)=null 
 ,@time_end          nvarchar(30)=null 
 ,@user_id			 int=null
)
AS
BEGIN
 SET NOCOUNT ON
 DECLARE @stmt nvarchar(max)
 SET @stmt = 'SELECT * FROM dbo.travel_history_v WHERE 1=1 '
 
 IF ISNULL(@vehicle_plate_no,'')<>''
    SET @stmt = @stmt + ' AND vehicle_plate_no like ''%' + @vehicle_plate_no + '%'''
 IF ISNULL(@last_name,'')<>''
	SET @stmt = @stmt + ' AND last_name like ''%' + @last_name + '%'''

 IF ISNULL(@first_name,'')<>''
	SET @stmt = @stmt + ' AND first_name like ''%' + @first_name + '%''' 
 --IF ISNULL(@travel_date,'')<>''
 --   BEGIN
		IF ISNULL(@time_start,'')<>'' and ISNULL(@time_end,'')<>''
		BEGIN
		  --SET @time_start = CONCAT(@travel_date,' ',@time_start)
		  --SET @time_end = CONCAT(@travel_date,' ',@time_end)

		  SET @stmt = @stmt + ' AND cast(payment_date as date) between ''' + @time_start + ''' AND ''' + @time_end + '''';
		 
		END
		 
	--ELSE
	   --SET @stmt = @stmt + ' AND cast(payment_date as date) = '''+ @travel_date +''''; 
	--END	

EXEC(@stmt);
END