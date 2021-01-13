
CREATE PROCEDURE [dbo].[image_file_upd](
       @company_id INT
      ,@company_logo NVARCHAR(200)

)
AS
BEGIN
SET NOCOUNT ON
update dbo.company_info
set company_logo=@company_logo
   where company_id = @company_id

END 