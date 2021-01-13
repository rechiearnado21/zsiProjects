


CREATE VIEW [dbo].[vehicles_v]
AS
SELECT rr.route_code, rr.route_desc,zfv.vehicle_id,zfv.vehicle_plate_no,zfv.route_id,zfv.company_id,zfv.hash_key,zfv.vehicle_type_id,zfv.is_active, 
                 zfv.vehicle_img_filename,zfv.created_by,zfv.created_date,zfv.updated_by, 
                 zfv.updated_date, dbo.fare_matrix.base_kms, dbo.fare_matrix.succeeding_km_fare, dbo.fare_matrix.vehicle_type, zfv.or_no
FROM     dbo.routes_ref rr INNER JOIN
                  zsi_fmis.dbo.vehicles zfv ON rr.route_id =zfv.route_id INNER JOIN
                  dbo.fare_matrix ON zfv.vehicle_type_id = dbo.fare_matrix.fare_id

