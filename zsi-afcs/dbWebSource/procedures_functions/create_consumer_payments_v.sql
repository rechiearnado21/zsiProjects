
CREATE PROCEDURE [dbo].[create_consumer_payments_v] 
   @consumer_id int
AS
BEGIN  
   SET NOCOUNT ON;

   DECLARE @view_name VARCHAR(100);
   DECLARE @create_view_stmt NVARCHAR(max);


   SET @view_name = CONCAT('consumer_payments_',@consumer_id,'_v');
   
   SET @create_view_stmt = 'CREATE VIEW dbo.' + @view_name + 
                     + ' AS SELECT * FROM dbo.payments WHERE consumer_id=' + CAST(@consumer_id AS VARCHAR(20))
   EXEC(@create_view_stmt);
END;

--[dbo].[create_consumer_payments_v] @consumer_id=1

