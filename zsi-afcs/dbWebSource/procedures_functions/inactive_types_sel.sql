
CREATE PROCEDURE [dbo].[inactive_types_sel]
( 
    @user_id INT = NULL
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.inactive_types WHERE 1=1 '; 
 END;

