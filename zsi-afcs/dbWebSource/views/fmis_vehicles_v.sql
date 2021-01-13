CREATE VIEW dbo.fmis_vehicle_v
AS
SELECT        zsi_fmis.dbo.vehicles.vehicle_id, zsi_fmis.dbo.vehicles.company_id, zsi_fmis.dbo.vehicles.vehicle_plate_no, zsi_fmis.dbo.vehicles.odometer_reading, zsi_fmis.dbo.vehicles.route_id, zsi_fmis.dbo.vehicles.is_active, 
                         zsi_fmis.dbo.vehicles.hash_key, dbo.driver_pao_assignment.driver_id, dbo.driver_pao_assignment.pao_id, zsi_fmis.dbo.vehicles.vehicle_type_id
FROM            zsi_fmis.dbo.vehicles LEFT OUTER JOIN
                         dbo.driver_pao_assignment ON zsi_fmis.dbo.vehicles.vehicle_id = dbo.driver_pao_assignment.vehicle_id
