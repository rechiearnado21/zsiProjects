
CREATE PROCEDURE [dbo].[vehicle_upd]
(
    @tt    vehicles_tt READONLY
   ,@user_id int
)
AS
BEGIN
   UPDATE a SET 
	   	 vehicle_plate_no	= b.vehicle_plate_no	
		,route_id			= b.route_id
		,vehicle_type_id	= b.vehicle_type_id
		,odometer_reading	= b.odometer_reading
		,is_active			= b.is_active		
	   	,updated_by			= @user_id
		,updated_date		= DATEADD(HOUR, 8, GETUTCDATE())
	FROM  zsi_fmis.dbo.vehicles a INNER JOIN @tt b
		ON a.vehicle_id = b.vehicle_id
	--WHERE isnull(b.is_edited,'N')  <> 'Y';

END;
