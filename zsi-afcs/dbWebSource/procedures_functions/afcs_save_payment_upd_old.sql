

CREATE PROCEDURE [dbo].[afcs_save_payment_upd_old]  
(  
   @serial_no NVARCHAR(30)
   , @vehicle_plate NVARCHAR(10)
   , @driver_id INT
   , @pao_id INT
   , @route_id INT
   , @from_location NVARCHAR(100)
   , @to_location NVARCHAR(100)
   , @travel_distance DECIMAL(12, 2)
   , @count_regular INT
   , @count_student INT
   , @count_senior INT
   , @count_pwd INT
   , @total_regular_fare DECIMAL(12, 2)
   , @total_student_fare DECIMAL(12, 2)
   , @total_senior_fare DECIMAL(12, 2)
   , @total_pwd_fare DECIMAL(12, 2)
   , @qr_code NVARCHAR(50)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @device_id INT = 0;
	DECLARE @vehicle_id INT;
	DECLARE @vehicle_route_id INT;
	DECLARE @qr_id INT;
	DECLARE @new_id NVARCHAR(50);

	SELECT 
		@device_id = device_id
	FROM dbo.devices WHERE 1 = 1
	AND serial_no = @serial_no;

	SELECT 
		@vehicle_id = vehicle_id
		, @vehicle_route_id = route_id
	FROM dbo.vehicles WHERE 1 = 1
	AND vehicle_plate_no = @vehicle_plate;

	SELECT 
		@qr_id = id
	FROM dbo.generated_qrs WHERE 1 = 1
	AND hash_key = @qr_code;

	SELECT @new_id = NEWID();
	
	BEGIN
		BEGIN TRAN;

		INSERT INTO [dbo].[payments](
			[payment_date]
           ,[device_id]
           ,[vehicle_id]
           ,[pao_id]
           ,[driver_id]
           ,[route_id]
           ,[from_location]
           ,[to_location]
           ,[no_klm]
           ,[no_reg]
           ,[no_stu]
           ,[no_sc]
           ,[no_pwd]
           ,[reg_amount]
           ,[stu_amount]
           ,[sc_amount]
           ,[pwd_amount]
		   ,[qr_id]
		   ,[payment_key]
		)
		VALUES(
			DATEADD(HOUR, 8, GETUTCDATE())
			, @device_id
			, @vehicle_id
			, @pao_id
			, @driver_id
			, @vehicle_route_id
			, @from_location
			, @to_location
			, @travel_distance
			, @count_regular
			, @count_student
			, @count_senior
			, @count_pwd
			, @total_regular_fare
			, @total_student_fare
			, @total_senior_fare
			, @total_pwd_fare
			, @qr_id
			, @new_id
		)

		IF @@ERROR = 0
		BEGIN
			COMMIT;
			SELECT 
				'Y' AS is_valid
				, 'Saving of payments is successful.' AS msg
				, @new_id AS payment_key
		END
		ELSE
		BEGIN
			ROLLBACK;
			SELECT 
				'N' AS is_valid
				, 'Error occurred while saving the payments.' AS msg
				, '' AS payment_key
		END
	END
END;