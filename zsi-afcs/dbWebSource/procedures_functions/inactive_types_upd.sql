

CREATE PROCEDURE [dbo].[inactive_types_upd]
(
    @tt    inactive_types_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET  inactive_type_code		= b.inactive_type_code
			,inactive_type_desc		= b.inactive_type_desc
			
     FROM dbo.inactive_types a INNER JOIN @tt b
        ON a.inactive_type_code = b.inactive_type_code 
       WHERE (
				isnull(a.inactive_type_code,'') <> isnull(b.inactive_type_code,'')   
			OR  isnull(a.inactive_type_desc,'') <> isnull(b.inactive_type_desc,'')   
		
	   )

-- Insert Process

    INSERT INTO inactive_types (
         inactive_type_code
		,inactive_type_desc
		
        )
    SELECT 
         inactive_type_code
		,inactive_type_desc
	   
    FROM @tt
    WHERE inactive_type_code is not null
	and inactive_type_desc is not null  
END


