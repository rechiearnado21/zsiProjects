

CREATE VIEW [dbo].[active_vehicles_v]
AS
SELECT        av.vehicle_id, av.company_id, av.vehicle_plate_no, av.conduction_no, av.chassis_no, av.engine_no, av.date_acquired, av.exp_registration_date, av.exp_insurance_date, av.vehicle_maker_id, av.odometer_reading, 
                         av.route_id, av.vehicle_type_id, av.is_active, av.status_id, av.hash_key, av.or_no, av.created_by, av.created_date, av.updated_by, av.updated_date, dbo.fare_matrix.vehicle_type, av.franchise_exp_date, driver_id, pao_id, route_detail_id
FROM            zsi_fmis.dbo.vehicles AS av INNER JOIN
                         dbo.fare_matrix ON av.vehicle_type_id = dbo.fare_matrix.fare_id
WHERE        (av.is_active = 'Y')

