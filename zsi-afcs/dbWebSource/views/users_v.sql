CREATE VIEW dbo.users_v
AS
SELECT        usr.user_id, usr.logon, usr.last_name, usr.first_name, usr.password, usr.role_id, usr.is_active, usr.is_admin, usr.img_filename, usr.first_name + N' ' + CASE WHEN middle_name IS NULL 
                         THEN '' ELSE middle_name END + ' ' + usr.last_name AS userFullName, usr.is_developer, usr.last_name + N',' + usr.first_name AS last_first_name, r.role_name, usr.middle_name, usr.name_suffix, 
                         dbo.clients_v.client_id AS company_code, usr.hash_key, usr.client_id AS company_id, dbo.clients_v.company_logo, dbo.clients_v.client_name AS company_name, usr.is_crm, usr.is_afcs, usr.is_hcm, usr.is_fmis, usr.has_img, 
                         usr.bank_id
FROM            zsi_crm.dbo.users AS usr LEFT OUTER JOIN
                         dbo.clients_v ON usr.client_id = dbo.clients_v.client_id LEFT OUTER JOIN
                         zsi_crm.dbo.roles AS r ON usr.role_id = r.role_id
WHERE        (usr.logon IS NOT NULL) AND (usr.is_afcs = 'Y')
