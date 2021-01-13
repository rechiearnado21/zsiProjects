

CREATE PROCEDURE [dbo].[afcs_pao_remit_sel]  
(  
	@vehicle_hash_key NVARCHAR(100)
    , @hash_key NVARCHAR(MAX)
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @stmt NVARCHAR(MAX);
    DECLARE @client_id  INT;
	DECLARE @vehicle_plate_no NVARCHAR(10);
	DECLARE @pao_id     INT;
	DECLARE @pao_name   NVARCHAR(100);
	DECLARE @cash_amount DECIMAL(10,2);
	DECLARE @tbl_employees NVARCHAR(50);
	DECLARE @tbl_client_payment NVARCHAR(50);
	DECLARE @tbl TABLE (
	    pao_id INT
	   , pao_name NVARCHAR(100)
	);
	DECLARE @tbl_amt TABLE (
	    cash_amount DECIMAL(10, 2)
	);
	
	SELECT 
		@client_id = company_id
		, @vehicle_plate_no = vehicle_plate_no 
	FROM dbo.active_vehicles_v 
	WHERE 1 = 1 
	AND hash_key = @vehicle_hash_key;

	SET @tbl_employees = CONCAT('zsi_hcm.dbo.employees_', @client_id, '_v');
	SET @tbl_client_payment = CONCAT('dbo.payments_', @client_id);
	
	SET @stmt = CONCAT('
		SELECT 
			id
			, CONCAT(first_name, '' '', last_name)
		FROM ', @tbl_employees, ' WHERE 1 = 1 AND emp_hash_key = ''', @hash_key, '''');

	INSERT INTO @tbl (pao_id, pao_name) EXEC(@stmt);
	SELECT @pao_id = pao_id, @pao_name = pao_name FROM @tbl;

	SET @stmt = CONCAT('
		SELECT 
			SUM(total_paid_amount) 
		FROM ', @tbl_client_payment, ' WHERE 1 = 1 AND ISNULL(qr_id, 0) = 0 AND is_open = ''Y'' 
		AND pao_id=', @pao_id
	);
    INSERT INTO @tbl_amt EXEC(@stmt);
	SELECT @cash_amount = cash_amount FROM @tbl_amt;

	SET @stmt = CONCAT('UPDATE dbo.payments SET is_open = ''N'' WHERE 1 = 1 AND is_open = ''Y'' AND pao_id = ', @pao_id);
	EXEC(@stmt);

	SET @stmt = CONCAT('UPDATE ', @tbl_client_payment, ' SET is_open = ''N'' WHERE 1 = 1 AND is_open = ''Y'' AND pao_id = ', @pao_id);
	EXEC(@stmt);

	SELECT 
		@vehicle_plate_no AS vehicle_plate_no
		, @pao_id   AS pao_id
		, @pao_name AS pao_name
	  	, ISNULL(@cash_amount,0) AS cash_amount; 
END;