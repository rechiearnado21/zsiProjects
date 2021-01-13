CREATE PROCEDURE [dbo].[drivers_sel](
 @client_id int
,@user_id int=null
,@tab_id int = 1
,@col_no int=1
,@order_no int=0
,@searchVal VARCHAR(50) = null
,@is_active VARCHAR(1)='Y'
,@rpp INT = 1000
)
AS
BEGIN
 SET NOCOUNT ON
	DECLARE @curDate DATE
	DECLARE @endDate NVARCHAR(10) 
	DECLARE @startDate NVARCHAR(10) 
	DECLARE @stmt NVARCHAR(MAX)
	DECLARE @driver_tbl NVARCHAR(100);
	DECLARE @orderby NVARCHAR(5);
	SET @driver_tbl = CONCAT('zsi_hcm.dbo.employees_',@client_id,'_v')
	SET @orderby = IIF(@order_no = 0,' ASC', ' DESC')

 IF @tab_id < 5
 BEGIN
 	SET @curDate = DATEADD(HOUR,8,GETUTCDATE())
	SET @startDate = CONVERT(VARCHAR(10),@curDate,101)
		SET @stmt = 'SELECT * FROM ' + @driver_tbl + ' WHERE is_driver=''Y''';

	IF @is_active <> ''
		SET @stmt = @stmt + ' AND is_active='''+ @is_active + '''';
 
	IF @tab_id = 2
    BEGIN
		SET @endDate = DATEADD(DAY,15,@curDate)
		SET @stmt = @stmt + ' AND CONVERT(VARCHAR(10),driver_license_exp_date,101) BETWEEN ''' + @startDate + ''' AND ''' + @endDate + '''';
	END

	IF @tab_id = 3
    BEGIN
		SET @endDate = CONVERT(VARCHAR(10),DATEADD(DAY,30,@curDate),101)
		SET @stmt = @stmt + ' AND CONVERT(VARCHAR(10),driver_license_exp_date,101) BETWEEN ''' + @startDate + ''' AND ''' + @endDate + '''';
	END
 
	IF @tab_id = 4
		SET @stmt = @stmt + ' AND CONVERT(VARCHAR(10),driver_license_exp_date,101) < ''' + CONVERT(VARCHAR(10),DATEADD(HOUR,8,GETUTCDATE()),101) + '''';
	
	IF isnull(@searchVal,'') <>''
	   SET @stmt = @stmt + ' AND first_name like ''%'+@searchVal+'%'' or last_name like ''%'+@searchVal+'%''';

	SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no as varchar(20));
  
	IF isnull(@order_no,0) <> 0
	   SET @stmt = @stmt + ' DESC'
     ELSE
	   SET @stmt = @stmt + ' ASC'
 END

 EXEC(@stmt);
END


--dbo.drivers_sel @client_id=1,@tab_id=2
