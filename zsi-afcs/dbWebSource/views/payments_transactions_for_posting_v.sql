CREATE VIEW dbo.payments_transactions_for_posting_v
AS
SELECT dbo.payments.payment_date, dbo.payments.payment_id, dbo.payments.vehicle_id, dbo.payments.driver_id, dbo.payments.route_id, dbo.payments.from_location, dbo.payments.to_location, dbo.payments.no_klm, dbo.payments.no_reg, 
                  dbo.payments.no_stu, dbo.payments.no_sc, dbo.payments.no_pwd, dbo.payments.reg_amount, dbo.payments.stu_amount, dbo.payments.sc_amount, dbo.payments.pwd_amount, dbo.payments.total_paid_amount, dbo.payments.post_id, 
                  dbo.routes_ref.route_code, vh.vehicle_plate_no, dbo.pao_v.user_id, dbo.drivers_v.full_name AS driver_name, dbo.pao_v.full_name AS pao_name, dbo.payments.client_id, vh.vehicle_type, dbo.payments.trip_id
FROM     dbo.payments INNER JOIN
                  dbo.vehicles_v AS vh ON dbo.payments.vehicle_id = vh.vehicle_id INNER JOIN
                  dbo.drivers_v ON dbo.payments.driver_id = dbo.drivers_v.user_id LEFT OUTER JOIN
                  dbo.routes_ref ON dbo.payments.route_id = dbo.routes_ref.route_id LEFT OUTER JOIN
                  dbo.pao_v ON dbo.payments.pao_id = dbo.pao_v.user_id
WHERE  (ISNULL(dbo.payments.post_id, 0) = 0)
