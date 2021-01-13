CREATE PROCEDURE [dbo].[tmp_files_upd] (  
  @user_id			int = null  
 ,@file_name		nvarchar(max) = NULL  
 ,@file_content     varbinary(50) = NULL  
 )  
AS  
BEGIN  
SET NOCOUNT ON    
INSERT INTO dbo.tmp_files  
 (  
   user_id
  ,file_name  
  ,file_content  
 )   
 VALUES (  
   @user_id  
  ,@file_name  
  ,@file_content 

 )  
 

RETURN  @@IDENTITY;  
END;  
  
   
  
  
