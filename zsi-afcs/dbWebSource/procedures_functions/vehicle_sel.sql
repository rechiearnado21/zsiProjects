CREATE PROCEDURE [dbo].[vehicle_sel]
(
   @user_id  int = null
  ,@client_id int = null
  ,@is_active varchar(1)='Y'
  ,@col_no INT = 3
  ,@order_no INT = 0
  ,@searchVal VARCHAR(50) = null
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt nvarchar(max)='';
	DECLARE @orderby    VARCHAR(5);

	SET @orderby = IIF(@order_no = 0, ' ASC',' DESC')
    SET @stmt = 'SELECT * FROM zsi_fmis.dbo.vehicles_' + CAST(@client_id AS NVARCHAR(20)) + ' WHERE 1=1 '
	
	IF ISNULL(@is_active,'') <> ''
	   set @stmt = @stmt + ' AND is_active = ''' + @is_active + ''''

	IF isnull(@searchVal,'') <>''
	   SET @stmt = @stmt + ' AND vehicle_plate_no like ''%'+@searchVal+'%''';

	set @stmt = @stmt + ' order by ' + cast(@col_no AS VARCHAR(20)) + @orderby

	EXEC(@stmt);
END

--vehicle_sel @is_active='N'
