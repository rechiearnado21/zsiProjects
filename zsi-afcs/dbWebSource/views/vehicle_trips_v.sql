CREATE VIEW dbo.vehicle_trips_v
AS
SELECT dbo.vehicles_v.vehicle_plate_no, dbo.drivers_v.full_name AS driver_name, dbo.pao_v.full_name AS pao_name, dbo.vehicle_trips.*
FROM     dbo.vehicle_trips INNER JOIN
                  dbo.drivers_v ON dbo.vehicle_trips.driver_id = dbo.drivers_v.user_id INNER JOIN
                  dbo.vehicles_v ON dbo.vehicle_trips.vehicle_id = dbo.vehicles_v.vehicle_id LEFT OUTER JOIN
                  dbo.pao_v ON dbo.vehicle_trips.pao_id = dbo.pao_v.user_id
