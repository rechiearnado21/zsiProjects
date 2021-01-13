
CREATE PROCEDURE [dbo].[afcs_pao_sel]  
(  
     @vehicle_hash_key NVARCHAR(100)
    ,@hash_key NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	DECLARE @stmt NVARCHAR(MAX);
    DECLARE @client_id  INT;
	DECLARE @tbl_employees NVARCHAR(50);

	SELECT @client_id=company_id FROM dbo.active_vehicles_v WHERE hash_key =@vehicle_hash_key;
	SET @tbl_employees = CONCAT('zsi_hcm.dbo.employees_',@client_id);

	SET @stmt = CONCAT('SELECT
		  id AS [user_id]
	    , client_id AS company_code
		, null AS logon
		, position_title AS position
		, last_name
		, first_name
		, emp_lfm_name AS full_name
		, is_active
		, emp_hash_key AS user_hash_key
	FROM ',@tbl_employees, ' WHERE position_id=4 AND emp_hash_key = ''',@hash_key,'''')
	EXEC(@stmt);
END;