


CREATE PROCEDURE [dbo].[dd_roles_sel] 
(
	@user_id				INT = NULL
)
as
	

begin
	SELECT * FROM zsi_crm.dbo.roles WHERE 1=1;
end
