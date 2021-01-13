CREATE PROCEDURE [dbo].[menus_upd]
(
   @tt    menus_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	      pmenu_id	   = b.pmenu_id
			 ,menu_name	   = b.menu_name
			 ,icon	       = b.icon
			 ,page_id	   = b.page_id
			 ,parameters   = b.parameters
	 		 ,seq_no       = b.seq_no
			 ,is_default   = b.is_default
			 ,is_admin     = b.is_admin
			 ,is_dev	   = b.is_dev	
	   	     ,updated_by   = @user_id
			 ,updated_date = DATEADD(HOUR, 8, GETUTCDATE())
       FROM dbo.menus a INNER JOIN @tt b
	     ON a.menu_id = b.menu_id 
	    AND (isnull(is_edited,'N')='Y')

-- Insert Process
	INSERT INTO menus (
         menu_name
		,icon
		,pmenu_id
		,page_id
		,parameters
		,seq_no		
		,is_default
		,is_admin
		,is_dev
		,created_by
		,created_date
    )
	SELECT 
		 menu_name
		,icon
		,pmenu_id
		,page_id
		,parameters
		,seq_no
		,is_default
		,is_admin
		,is_dev
	    ,@user_id
	    ,DATEADD(HOUR, 8, GETUTCDATE())
	FROM @tt 
	WHERE menu_id IS NULL
      AND menu_name IS NOT NULL;



