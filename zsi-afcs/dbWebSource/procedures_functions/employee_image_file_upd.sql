

CREATE PROCEDURE [dbo].[employee_image_file_upd](
   @user_id			INT = NULL
  ,@tmp_file_id		INT 
)
AS
BEGIN

  DECLARE @file_name		nvarchar(50) = NULL  
  DECLARE @file_content     varbinary(max) = NULL        

	SET NOCOUNT ON 
	
	select  @file_name=file_name,@file_content = file_content from tmp_files where tmp_file_id=@tmp_file_id

	DECLARE @stmt		VARCHAR(4000);
	DECLARE @client_id  INT;
	SELECT @client_id=company_id FROM dbo.users_v where user_id = @user_id;

	INSERT INTO zsi_hcm.dbo.employee_images  
		 (  
		   user_id
		  ,file_name  
		  ,file_content  
		 )   
		 VALUES(
			@user_id
			,@file_name
			,@file_content
		) 

		Return @@identity;
			
      --update zsi_hcm.dbo.employee_client_id @@identity
		--remove temporary file.
		--delete from tmp_files where tmp_file_id=@tmp_file_id
END 

--exec employee_image_file_upd @user_id=2,@tmp_file_id=4

