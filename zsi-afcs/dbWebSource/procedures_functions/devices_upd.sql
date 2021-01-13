CREATE PROCEDURE [dbo].[devices_upd]
(
    @tt    device_tt READONLY
   ,@user_id int
)
AS
   DECLARE @client_id  INT;
   SELECT @client_id=company_id FROM dbo.users_v where user_id = @user_id;
-- Update Process
	UPDATE a 
		   SET 
			 serial_no				= b.serial_no
			,mobile_no				= b.mobile_no
			,is_active				= b.is_active
			,load_date				= b.load_date
	   	    ,updated_by				= @user_id
			,updated_date			= DATEADD(HOUR, 8, GETUTCDATE())

       FROM dbo.devices a INNER JOIN @tt b
	     ON a.device_id = b.device_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);

-- Insert Process
	INSERT INTO devices (
		 serial_no					
	    ,mobile_no	
		,is_active
		,hash_key
		,company_id
		,load_date
		,created_by
		,created_date
    )
	SELECT 
         serial_no
		,mobile_no
		,is_active
		,newid()
		,@client_id
		,load_date
		,@user_id
		,DATEADD(HOUR, 8, GETUTCDATE())

	FROM @tt 
	WHERE device_id IS NULL
	AND serial_no IS NOT NULL 

