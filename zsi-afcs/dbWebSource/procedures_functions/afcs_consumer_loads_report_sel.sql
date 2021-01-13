
CREATE PROCEDURE [dbo].[afcs_consumer_loads_report_sel]  
(  
     @username NVARCHAR(300)
   , @user_id INT = NULL
)  
AS   
BEGIN  
	SET NOCOUNT ON;
	DECLARE @consumer_id int;
	DECLARE @consumer_qr_id int;
	DECLARE @view_name NVARCHAR(100);
	DECLARE @stmt NVARCHAR(MAX)
	
	SELECT @consumer_id = consumer_id FROM dbo.consumers where mobile_no = @username;
	SET @view_name = CONCAT('dbo.consumer_loading_',@consumer_id,'_v');
    
	SET @stmt = CONCAT('SELECT top 1000 loading_id, load_date, load_amount, CONCAT(''Ref. No.: '', ref_no) store_code  FROM ',@view_name,' ORDER BY	loading_id desc');

EXEC(@stmt);
END;
--[dbo].[afcs_consumer_loads_report_sel] @username='09178997742'


