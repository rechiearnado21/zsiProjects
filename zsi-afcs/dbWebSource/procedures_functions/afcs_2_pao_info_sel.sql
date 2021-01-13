
CREATE PROCEDURE [dbo].[afcs_2_pao_info_sel]  
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
	DECLARE @count INT;
    CREATE TABLE #pao (
	  user_id int
	 ,hash_key nvarchar(100)
	 ,first_name nvarchar(100)
	 ,last_name  nvarchar(100)
	 ,img_filename nvarchar(100)
	 ,is_active char(1)
	)

	SELECT @client_id=company_id FROM dbo.active_vehicles_v WHERE hash_key =@vehicle_hash_key;
	SET @tbl_employees = CONCAT('zsi_hcm.dbo.employees_',@client_id);

	SET @stmt = CONCAT('SELECT
		  id AS [user_id]
	    , emp_hash_key AS user_hash_key
		, first_name
		, last_name
		, cast('''' as xml).value(''xs:base64Binary(sql:column("img_filename"))'', ''varchar(max)'') AS img_filename
		, is_active
	FROM ',@tbl_employees, ' WHERE is_pao = ''Y'' AND is_active = ''Y'' AND emp_hash_key = ''',@hash_key,'''')
	INSERT INTO #pao EXEC(@stmt);
	SELECT @count = COUNT(*) FROM #pao;
	
	IF @count = 1
	BEGIN
		SELECT
			  [user_id]
			, [hash_key]
			, [first_name]
			, [last_name]
			, [img_filename]
			, [is_active]
			, 'Y' AS is_valid
			, 'Success' AS msg
		FROM #pao
		WHERE 1 = 1
		AND hash_key = @hash_key;
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 'Error' AS msg
	END
	DROP TABLE #pao;
END;