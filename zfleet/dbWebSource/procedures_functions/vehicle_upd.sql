CREATE PROCEDURE [dbo].[vehicle_upd]
(
    @tt    vehicles_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	     vehicle_plate_no	= b.vehicle_plate_no	
			,route_id			= b.route_id
			,company_code		= b.company_code
			,vehicle_type_id	= b.vehicle_type_id
			,is_active			= b.is_active		
	   	    ,updated_by			= @user_id
			,updated_date		= GETDATE()

       FROM dbo.vehicles a INNER JOIN @tt b
	     ON a.vehicle_id = b.vehicle_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO vehicles(
         vehicle_plate_no
		,route_id
		,company_code
		,hash_key
		,vehicle_type_id
		,is_active
		,created_by
		,created_date
    )
	SELECT 
		 vehicle_plate_no
		,route_id
		,company_code
		,newid()
		,vehicle_type_id
		,is_active	
	    ,@user_id
	    ,GETDATE()
	FROM @tt 
	WHERE vehicle_id IS NULL
	AND ISNULL(vehicle_plate_no,'') <>''
 




