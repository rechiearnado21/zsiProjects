

CREATE VIEW [dbo].[roles_v]
AS
SELECT        role_id, role_name, dbo.countRoleMenus(role_id) AS countRoleMenus, dbo.countUsers(role_id) AS countUsers
FROM            zsi_crm.dbo.roles




