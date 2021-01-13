
CREATE PROCEDURE [dbo].[data_test_upd]
(
    @tt    data_test_tt READONLY
   ,@user_id int = null
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET  col1  = b.col1
			,col2  = b.col2
			,col3  = b.col3			
     FROM dbo.data_test a INNER JOIN @tt b
        ON a.data_id = b.data_id 
		--WHERE isnull(b.is_edited,'N') = 'Y'  

-- Insert Process
    INSERT INTO data_test (
		 col1
		,col2
        ,col3
        ,created_datetime
        )
    SELECT 
	     col1
		,col2
        ,col3
       ,DATEADD(HOUR, 8, GETUTCDATE())
    FROM @tt
    WHERE data_id IS NULL


END


