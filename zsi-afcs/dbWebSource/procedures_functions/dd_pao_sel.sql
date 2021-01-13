


CREATE PROCEDURE [dbo].[dd_pao_sel] 
(
	@user_id				INT 
)
as
	

begin
    DECLARE @stmt NVARCHAR(MAX)
	DECLARE @client_id int
	SELECT @client_id = company_id FROM dbo.users_v WHERE user_id = @user_id;
	SET @stmt = CONCAT('SELECT id, emp_lfm_name fullname FROM zsi_hcm.dbo.employees_',@client_id,'_v WHERE is_pao=''Y''');
	EXEC(@stmt);
end


