CREATE VIEW dbo.payments_v
AS
SELECT        dbo.payments.payment_id, dbo.payments.payment_date, dbo.payments.total_paid_amount, dbo.payments.qr_id, dbo.payments.consumer_id, dbo.drivers_v.full_name AS driver_name, dbo.payments.no_reg, 
                         dbo.payments.no_stu, dbo.payments.no_sc, dbo.payments.no_pwd, dbo.payments.reg_amount, dbo.payments.stu_amount, dbo.payments.sc_amount, dbo.payments.pwd_amount, dbo.vehicles_v.vehicle_plate_no, 
                         dbo.vehicles_v.vehicle_type, dbo.payments.client_id, dbo.payments.base_fare, dbo.payments.vehicle_id, dbo.payments.driver_id, dbo.payments.pao_id, dbo.payments.trip_id, dbo.vehicle_trips.trip_no, 
                         dbo.vehicle_trips.start_date, dbo.vehicle_trips.start_odo, dbo.vehicle_trips.end_date, dbo.vehicle_trips.end_odo
FROM            dbo.payments INNER JOIN
                         dbo.drivers_v ON dbo.payments.driver_id = dbo.drivers_v.user_id INNER JOIN
                         dbo.vehicles_v ON dbo.payments.vehicle_id = dbo.vehicles_v.vehicle_id INNER JOIN
                         dbo.vehicle_trips ON dbo.payments.trip_id = dbo.vehicle_trips.trip_id
