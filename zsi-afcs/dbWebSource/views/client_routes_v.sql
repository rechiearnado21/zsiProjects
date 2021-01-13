CREATE VIEW dbo.client_routes_v
AS
SELECT        dbo.client_routes.route_id, dbo.routes_ref.route_code, dbo.routes_ref.route_desc, dbo.client_routes.client_id
FROM            dbo.client_routes INNER JOIN
                         dbo.routes_ref ON dbo.client_routes.route_id = dbo.routes_ref.route_id
