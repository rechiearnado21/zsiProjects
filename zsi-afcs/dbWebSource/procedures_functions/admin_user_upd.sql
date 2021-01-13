CREATE PROCEDURE [dbo].[admin_user_upd] (
  @logon      nvarchar(50) -- valid email address
 ,@company_id int
 ,@password   nvarchar(20)
 ,@last_name nvarchar(20)
 ,@first_name nvarchar(20)
 ,@middle_name nvarchar(20)=null
 ,@name_suffix nvarchar(5)=null
 ,@user_id int=null
)
AS
BEGIN
  INSERT INTO dbo.users
  (
	logon      
   ,company_id 
   ,password   
   ,last_name 
   ,first_name 
   ,middle_name
   ,name_suffix
   ,hash_key
   ,is_admin
   ,created_date
   )VALUES (
    @logon      
   ,@company_id 
   ,@password   
   ,@last_name 
   ,@first_name 
   ,@middle_name
   ,@name_suffix
   ,newid()
   ,'Y'
   ,DATEADD(HOUR, 8, GETUTCDATE())
   );
END;  
