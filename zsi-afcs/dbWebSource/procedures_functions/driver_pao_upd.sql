

CREATE PROCEDURE [dbo].[driver_pao_upd]
(
    @tt    driver_pao_tt READONLY
   ,@user_id int
)
AS
BEGIN
-- Update Process
   DECLARE @client_id INT;
   DECLARE @stmt NVARCHAR(MAX);
   SELECT @client_id = company_id FROM dbo.users_v where user_id=@user_id;
   CREATE TABLE #emp (
	[id] [int] NULL,
	[is_edited] [char](1) NULL,
	[client_id] [int] NULL,
	[employee_no] [nvarchar](50) NULL,
	[last_name] [nvarchar](50) NULL,
	[first_name] [nvarchar](50) NULL,
	[middle_name] [nvarchar](50) NULL,
	[name_suffix] [nvarchar](50) NULL,
	[gender] [char](1) NULL,
	[contact_phone_no] [nvarchar](50) NULL,
	[driver_academy_no] [nvarchar](50) NULL,
	[driver_license_no] [nvarchar](50) NULL,
	[driver_license_exp_date] [date] NULL,
	[is_driver] [char](1) NULL,
	[is_pao] [char](1) NULL,
	[is_active] [varchar](1) NULL)
	
	INSERT INTO #emp SELECT * FROM @tt;
   SET @stmt = CONCAT('
	UPDATE a 
		   SET 
	   	      employee_no				= b.employee_no
			 ,last_name					= b.last_name				
			 ,first_name				= b.first_name			
			 ,middle_name				= b.middle_name			
	 		 ,name_suffix				= b.name_suffix			
			 ,gender					= b.gender				
			 ,contact_phone_no			= b.contact_phone_no
			 ,driver_academy_no			= b.driver_academy_no
			 ,driver_license_no			= b.driver_license_no
			 ,driver_license_exp_date	= b.driver_license_exp_date
			 ,is_driver					= b.is_driver
			 ,is_pao					= b.is_pao
			 ,is_active					= b.is_active
			 ,updated_by				=', @user_id ,'
			 ,updated_date				= DATEADD(HOUR, 8, GETUTCDATE())
        FROM zsi_hcm.dbo.employees_',@client_id,' a INNER JOIN #emp b
	     ON a.id = b.id 
		WHERE b.id IS NOT NULL
	    AND isnull(b.is_edited,''N'')=''Y''
		AND b.last_name IS NOT NULL
		AND b.first_name IS NOT NULL')
   EXEC(@stmt);

-- Insert Process
	SET @stmt = CONCAT('INSERT INTO zsi_hcm.dbo.employees_',@client_id,'(
		 employee_no		
		,last_name			
		,first_name		
		,middle_name		
		,name_suffix		
		,gender			
		,emp_hash_key
		,contact_phone_no
		,driver_academy_no
		,driver_license_no
		,driver_license_exp_date
		,is_driver	
		,is_pao	
		,is_active			
		,created_by
		,created_date
    )
	SELECT 
         employee_no
		,last_name			
		,first_name		
		,middle_name		
		,name_suffix		
		,gender			
		,NEWID()
		,contact_phone_no
		,driver_academy_no
		,driver_license_no
		,driver_license_exp_date
		,is_driver
		,is_pao
		,is_active			
		,',@user_id,'
	    ,DATEADD(HOUR, 8, GETUTCDATE())
	FROM #emp
	WHERE id IS NULL
      AND last_name IS NOT NULL
	  AND first_name IS NOT NULL
	  ');
   EXEC(@stmt);
   DROP TABLE #emp;
END;
