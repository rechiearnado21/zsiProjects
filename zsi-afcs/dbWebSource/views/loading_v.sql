

CREATE VIEW [dbo].[loading_v]
AS
SELECT        dbo.loading.*, usr.company_id, CONCAT(usr.first_name,' ', usr.last_name) as loaded_by
FROM            dbo.loading LEFT JOIN
                         dbo.users_v usr ON dbo.loading.load_by = usr.user_id


