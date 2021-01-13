CREATE PROCEDURE [dbo].[users_change_pwd_upd]
(
    @user_id int
   ,@password nvarchar(200)
)

AS
SET NOCOUNT ON
UPDATE zsi_crm.dbo.users SET password=@password WHERE user_id=@user_id


 



