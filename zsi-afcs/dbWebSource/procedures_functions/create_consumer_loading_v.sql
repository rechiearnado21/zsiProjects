
CREATE PROCEDURE [dbo].[create_consumer_loading_v]( 
   @consumer_id int )
AS
BEGIN  
   SET NOCOUNT ON;

   DECLARE @view_name VARCHAR(100);
   DECLARE @qr_id INT;
   DECLARE @create_view_stmt NVARCHAR(max);

   SELECT @qr_id=qr_id FROM dbo.consumers where consumer_id = @consumer_id;
   SET @view_name = CONCAT('consumer_loading_',@consumer_id,'_v');
   
   SET @create_view_stmt = CONCAT('CREATE VIEW dbo.',@view_name,' AS 
                                  SELECT loading_id, load_date,load_amount, load_by, ref_no, 
								  iif(is_top_up=''Y'',''Share-a-load'',''PREPAID LOAD'') store_code  
                                  FROM dbo.loading WHERE qr_id=',@qr_id,
                                  'UNION SELECT loading_id, load_date,(load_amount * -1) load_amount, load_by, ref_no, 
								  ''Share-a-load'' store_code
								  FROM dbo.loading WHERE load_by=',@consumer_id);
   EXEC(@create_view_stmt);
END;

--[dbo].[create_consumer_loading_v] @consumer_id=1



