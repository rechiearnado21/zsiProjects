CREATE PROCEDURE [dbo].[driver_pao_assignment_upd]
(
    @tt    drivers_pao_assignment_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	      client_id			= b.client_id
			 ,vehicle_id		= b.vehicle_id	
			 ,assignment_date	= b.assignment_date		
			 ,driver_id			= b.driver_id	
			 ,pao_id			= b.pao_id	
			 ,shift_id		    = b.shift_id	  
			 ,updated_by		= @user_id
			 ,updated_date		= DATEADD(HOUR, 8, GETUTCDATE())
       FROM dbo.driver_pao_assignment a INNER JOIN @tt b
	     ON a.driver_pao_assignment_id = b.drivers_pao_assignment_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO driver_pao_assignment (
		   client_id
		  ,vehicle_id
		  ,assignment_date	
		  ,driver_id	
		  ,pao_id	
		  ,shift_id	
		  ,created_by
		  ,created_date 		  
    )
	SELECT 
		   client_id
		  ,vehicle_id
		  ,assignment_date	
		  ,driver_id	
		  ,pao_id	
		  ,shift_id	  
		  ,@user_id
		  ,DATEADD(HOUR, 8, GETUTCDATE())
		  

	FROM @tt 
	WHERE drivers_pao_assignment_id IS NULL

	AND ISNULL(client_id,0) <> 0 
	AND ISNULL(vehicle_id,0) <> 0
	AND ISNULL(driver_id,0) <> 0
	AND ISNULL(pao_id,0) <> 0
	AND ISNULL(shift_id,0) <> 0
