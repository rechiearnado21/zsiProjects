


CREATE PROCEDURE [dbo].[users_upd]
(
    @tt     users_tt READONLY
   ,@user_id int
)
AS
SET NOCOUNT ON
DECLARE @updated_count INT;

-- Update Process
   UPDATE a 
       SET logon		= b.logon --lower(dbo.createUserLogon(b.user_id)) 
	      ,first_name	= b.first_name
		  ,last_name	= b.last_name
		  ,middle_name	= b.middle_name
		  ,name_suffix	= b.name_suffix
		  ,role_id		= b.role_id
		  ,is_admin		= b.is_admin
		  ,is_active	= b.is_active
          ,updated_by   = @user_id
          ,updated_date = DATEADD(HOUR, 8, GETUTCDATE())
       FROM zsi_crm.dbo.users a INNER JOIN @tt b
        ON a.user_id = b.user_id 
       AND isnull(b.is_edited,'N')='Y'

-- Insert Process
	INSERT INTO zsi_crm.dbo.users(
         client_id
		,logon
		,first_name
		,last_name
		,middle_name
		,name_suffix
		,role_id
		,is_admin	
		,is_active
		,is_afcs
		,created_by
		,created_date
    )
	SELECT 
		 client_id
		,logon
		,first_name
		,last_name
		,middle_name
		,name_suffix
		,role_id
		,is_admin	
		,is_active
		,'Y'
	    ,@user_id
	    ,DATEADD(HOUR, 8, GETUTCDATE())
	FROM @tt 
	WHERE user_id IS NULL
	AND logon IS NOT NULL
	AND role_id IS NOT NULL


SET @updated_count = @@ROWCOUNT;

SET @updated_count = @updated_count + @@ROWCOUNT;
RETURN @updated_count;










