

CREATE PROCEDURE [dbo].[afcs_emp_in_out_upd]  
(  
    @vehicle_hash_key NVARCHAR(MAX)
	, @device_hash_key NVARCHAR(MAX)
	, @emp_hash_key NVARCHAR(MAX)
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @client_id INT;
	DECLARE @is_active CHAR(1);
	DECLARE @employee_id INT;
	DECLARE @tbl_employees NVARCHAR(100)
	DECLARE @tbl_dtr NVARCHAR(50);
	DECLARE @stmt NVARCHAR(MAX);
	DECLARE @device_id INT = NULL;
	DECLARE @msg NVARCHAR(100);

	SELECT @client_id = company_id FROM dbo.active_vehicles_v WHERE 1 = 1 AND hash_key = @vehicle_hash_key;
	SET @tbl_employees = concat('zsi_hcm.dbo.employees_', @client_id);
	SET @tbl_dtr = concat('zsi_hcm.dbo.dtr_', @client_id);

	SELECT @device_id = device_id FROM dbo.devices_v WHERE 1 = 1 AND hash_key = @device_hash_key;

	SET @stmt = CONCAT(
		'SELECT
			@employee_id = id
		FROM ', @tbl_employees, ' WHERE 1 = 1 AND emp_hash_key = ''', @emp_hash_key, ''''
	);

	--print @stmt;

	EXEC sp_executesql @stmt, N'
			@employee_id INT OUTPUT'
		, @employee_id OUTPUT;

	IF @employee_id IS NOT NULL
	BEGIN
		DECLARE @dtr_sql NVARCHAR(MAX);
		DECLARE @error INT = 0;
		DECLARE @dtr_id INT;
		DECLARE @dt_in DATETIME;

		-- Get the record of the employee that has a time in.
		SET @dtr_sql = CONCAT(
			'SELECT TOP 1 @dtr_id = id, @dt_in = dt_in FROM '
			, @tbl_dtr
			, ' WHERE 1 = 1 AND employee_id = '''
			, @employee_id
			, ''''
			, ' AND dt_in IS NOT NULL AND dt_out IS NULL ORDER BY id DESC '
		);
		EXEC sp_executesql @dtr_sql, N'
				@dtr_id INT OUTPUT, @dt_in DATETIME OUTPUT'
			, @dtr_id OUTPUT
			, @dt_in OUTPUT;

		-- If time in is null, create a time in record.
		BEGIN TRAN;

		IF @dtr_id IS NULL
		BEGIN
			DECLARE @new_dt_in DATETIME = DATEADD(HOUR,8,GETUTCDATE());
			DECLARE @new_dtr_date DATE = CONVERT(DATE, @new_dt_in);
			DECLARE @insert_sql NVARCHAR(MAX);

			SET @insert_sql = CONCAT('INSERT INTO ', @tbl_dtr,' (employee_id, dtr_date, in_device_id, dt_in) VALUES(',@employee_id,',''',@new_dtr_date,''',', @device_id,',''',CAST(@new_dt_in AS VARCHAR(20)),''')')
			EXEC(@insert_sql);
			SET @msg = 'Login successful.'
		END;
		-- If time in is not null, update the time out record.		
		ELSE
		BEGIN
			DECLARE @dt_out DATETIME = DATEADD(HOUR,8,GETUTCDATE());
			DECLARE @update_sql NVARCHAR(MAX);

			SET @update_sql = CONCAT('UPDATE ', @tbl_dtr, ' SET dt_out = ''',@dt_out,''',out_device_id =',@device_id,' WHERE 1 = 1 AND id = ', @dtr_id);
			EXEC(@update_sql);
			SET @msg = 'Logout successful.'
		END

		IF @@ERROR = 0
		BEGIN
			COMMIT;
			SELECT
				'Y' AS is_valid
				, @msg AS msg
		END
		ELSE
		BEGIN
			ROLLBACK;
			SELECT
				'N' AS is_valid
				, 'Sorry, something went wrong while saving the log info.' AS msg
		END
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 'Sorry, employee is not registered.' AS msg
	END
END;