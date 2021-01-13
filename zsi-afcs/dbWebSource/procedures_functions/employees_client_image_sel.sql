
CREATE PROCEDURE [dbo].[employees_client_image_sel]
(
	 @client_id  int
	,@emp_id	int
 
	
)
AS
BEGIN
  SET NOCOUNT ON
  	DECLARE @stmt		VARCHAR(4000);
	
 	DECLARE @tbl_eimg  NVARCHAR(100) = CONCAT('zsi_hcm.dbo.employee_images_',@client_id)

	SET  @stmt =   CONCAT('SELECT file_name,file_content FROM ',@tbl_eimg, ' WHERE user_id=',@emp_id)
	print (@stmt);
	exec (@stmt);
   RETURN @@ROWCOUNT;
 END;