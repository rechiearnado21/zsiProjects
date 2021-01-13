

CREATE PROCEDURE [dbo].[vehicles_sel]
(
    @client_id nvarchar(100)
   ,@user_id INT = NULL
   ,@route_id nvarchar(100)=null
   ,@is_active VARCHAR(1)='Y'
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

	BEGIN
		IF @is_active = 'Y'
			SET @stmt = 'SELECT * FROM zsi_fmis.dbo.vehicles WHERE company_id=''' + @client_id + '''';
		ELSE
			SET @stmt = 'SELECT * FROM zsi_fmis.dbo.vehicles WHERE company_id=''' + @client_id + '''';
	END

	IF ISNULL(@route_id,'')<>''
       set @stmt = @stmt + ' AND route_id = ''' + @route_id  + ''''

	exec(@stmt);
 END;


 --[dbo].[vehicles_sel] @client_id=1