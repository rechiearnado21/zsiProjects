
CREATE PROCEDURE [dbo].[zload_transactions_sel]  
(  
   @merchant_hash_key NVARCHAR(MAX)
   , @device_hash_key NVARCHAR(MAX)
   , @history_date DATE
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @device_id INT;

	SELECT @device_id = device_id FROM zsi_load.dbo.devices WHERE 1 = 1 AND hash_key = @device_hash_key;
	
	SELECT TOP 10000
		a.load_date
		, a.load_amount
		, a.ref_no
		, CONCAT(c.first_name, ' ', c.last_name) AS loader_name
	FROM dbo.loading a
	LEFT JOIN zsi_load.dbo.load_personnel c
	ON a.load_by = c.id
	LEFT JOIN zsi_crm.dbo.clients d
	ON a.[loading_branch_id] = d.client_id
	WHERE 1 = 1
	AND d.hash_key = @merchant_hash_key
	AND CAST(a.load_date AS DATE) = @history_date
	AND a.device_id = @device_id
	ORDER BY
		load_date;
END;