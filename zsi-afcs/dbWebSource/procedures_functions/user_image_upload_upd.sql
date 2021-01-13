  
CREATE PROCEDURE [dbo].[user_image_upload_upd](  
	   @emp_id NVARCHAR(100)
	  ,@client_id NVARCHAR(100)
	  ,@image NVARCHAR(MAX)
	  ,@user_id INT = null
	  ,@file_name NVARCHAR(50)
  
)  
AS  
BEGIN  
SET NOCOUNT ON  
  DECLARE @stmt				NVARCHAR(MAX) = '';
  DECLARE @table NVARCHAR(100) = CONCAT('zsi_hcm.dbo.employee_images_',@client_id)
  DECLARE @id INT;
  DECLARE @identity INT;

  INSERT INTO zsi_afcs.dbo.tmp_files  ( user_id,file_name ,file_content )   
  VALUES ( @emp_id,@file_name,CAST(N'' AS xml).value('xs:base64Binary(sql:variable("@image"))', 'varbinary(max)') )
  SET @identity = @@IDENTITY;

  SET @stmt=N'SELECT @id = file_id FROM '+@table+' WHERE user_id ='+@emp_id+''; 
  EXEC SP_EXECUTESQL @stmt, N'@id INT OUTPUT, @emp_id INT',  @emp_id = @emp_id, @id = @id OUTPUT ;

  IF @id <> 0
	  BEGIN
	    SET @stmt = CONCAT('UPDATE a SET a.file_name = b.file_name, 
									 a.file_content = b.file_content  
									 FROM ',@table, ' a, zsi_afcs.dbo.tmp_files b
									 WHERE a.user_id = b.user_id AND b.user_id =',@emp_id); 
		EXEC(@stmt);
	  END
  ELSE
	  BEGIN
		SET @stmt = CONCAT('INSERT INTO ',@table, ' (user_id,file_name,file_content)  SELECT ',@emp_id,',file_name,file_content FROM zsi_afcs.dbo.tmp_files WHERE tmp_file_id=',@identity)
		EXEC(@stmt);
	  END
  UPDATE zsi_crm.dbo.users SET has_img = 'Y' WHERE user_id = @emp_id AND client_id = @client_id;
  DELETE FROM zsi_afcs.dbo.tmp_files WHERE tmp_file_id=@identity;
END


--[dbo].[user_image_upload_upd] @emp_id =7, @client_id =0, @image ='asdasdaggsdgsgsgsd'