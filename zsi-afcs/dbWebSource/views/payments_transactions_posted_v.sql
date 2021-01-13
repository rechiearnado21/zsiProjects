
CREATE VIEW [dbo].[payments_transactions_posted_v]
AS
SELECT dbo.payments.payment_date, dbo.payments.payment_id, dbo.payments.vehicle_id, dbo.payments.driver_id, dbo.payments.route_id, dbo.payments.from_location, dbo.payments.to_location, dbo.payments.no_klm, dbo.payments.no_reg, 
                  dbo.payments.no_stu, dbo.payments.no_sc, dbo.payments.no_pwd, dbo.payments.reg_amount, dbo.payments.stu_amount, dbo.payments.sc_amount, dbo.payments.pwd_amount, dbo.payments.total_paid_amount, dbo.payments.post_id, 
                  dbo.routes_ref.route_code, vh.vehicle_plate_no, zsi_fmis.dbo.pao_v.id, CONCAT(zsi_fmis.dbo.drivers_v.last_name, ', ',zsi_fmis.dbo.drivers_v.first_name ) AS driver_name, Concat(zsi_fmis.dbo.pao_v.last_name, ', ',zsi_fmis.dbo.pao_v.first_name) AS pao_name, dbo.payments.client_id, dbo.posting_dates.posted_date, vh.vehicle_type, 
                  dbo.payments.trip_id
FROM     dbo.payments INNER JOIN
                  dbo.routes_ref ON dbo.payments.route_id = dbo.routes_ref.route_id INNER JOIN
                  dbo.vehicles_v AS vh ON dbo.payments.vehicle_id = vh.vehicle_id INNER JOIN
                  zsi_fmis.dbo.drivers_v ON dbo.payments.driver_id = zsi_fmis.dbo.drivers_v.id INNER JOIN
                  dbo.posting_dates ON dbo.payments.post_id = dbo.posting_dates.id LEFT OUTER JOIN
                  zsi_fmis.dbo.pao_v ON dbo.payments.pao_id = zsi_fmis.dbo.pao_v.id
WHERE  (ISNULL(dbo.payments.post_id, 0) <> 0) 
