

CREATE PROCEDURE [dbo].[drivers_upd]
(
    @tt    drivers_tt READONLY
   ,@user_id int
)
AS
BEGIN
DECLARE @client_id int;
CREATE TABLE #drivers (
	[user_id] [int] NULL,
	[client_id] [int] NULL,
	[emp_hash_key] [nvarchar](500) NULL,
	[is_edited] [char](1) NULL,
	[last_name] [nvarchar](200) NULL,
	[first_name] [nvarchar](200) NULL,
	[middle_name] [nvarchar](50) NULL,
	[name_suffix] [nvarchar](50) NULL,
	[driver_academy_no] [nvarchar](50) NULL,
	[driver_license_no] [nvarchar](50) NULL,
	[driver_license_exp_date] [nvarchar](50) NULL,
	[position_id] [int] NULL,
	[is_active] [varchar](1) NULL)

   SELECT @client_id =company_id FROM dbo.users_v where user_id=@user_id;
   INSERT INTO #drivers SELECT * FROM @tt;
-- Update Process 
    DECLARE @stmt NVARCHAR(MAX)
	SET @stmt = CONCAT('UPDATE a  SET last_name	= b.last_name 
				,middle_name					= b.middle_name
				,name_suffix					= b.name_suffix
				,driver_academy_no				= b.driver_academy_no
				,driver_license_no				= b.driver_license_no
				,driver_license_exp_date		= b.driver_license_exp_date
				,is_active						= b.is_active		   	    
       FROM zsi_hcm.dbo.employees_',@client_id,' a INNER JOIN #drivers b
	     ON a.id = b.user_id
	     WHERE (isnull(b.is_edited,''N'') = ''Y''');
    EXEC(@stmt);
	drop table #drivers;
END;