
CREATE PROCEDURE [dbo].[devices_sel]
(
    @company_id nvarchar(50)
   ,@user_id int
   ,@searchVal nvarchar(100) = NULL
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX);

	SET @stmt =	'SELECT * FROM dbo.devices WHERE company_id =' + @company_id;

	IF isnull(@searchVal,'') <> ''
		SET @stmt = @stmt + ' AND serial_no like ''%'+@searchVal+'%'' or mobile_no like ''%'+@searchVal+'%''';
	EXEC(@stmt);
END

--[dbo].[devices_sel] @company_id=5,@user_id=8 