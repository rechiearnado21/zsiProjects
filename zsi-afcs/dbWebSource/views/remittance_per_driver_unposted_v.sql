

CREATE VIEW [dbo].[remittance_per_driver_unposted_v]
AS
SELECT dbo.payments.payment_date, dbo.payments.total_paid_amount, dbo.vehicles.vehicle_plate_no, users.full_name account_name,
       iif(users.transfer_type_id=1,dbo.banks.bank_name, dbo.transfer_types.transfer_type) transfer_to, 
        dbo.vehicles.transfer_no AS account_no, dbo.payments.post_id, dbo.payments.remit_id,dbo.transfer_types.transfer_type_id
FROM     dbo.payments INNER JOIN
                  dbo.vehicles ON dbo.payments.vehicle_id = dbo.vehicles.vehicle_id INNER JOIN
                  dbo.users ON dbo.payments.driver_id = dbo.users.user_id INNER JOIN
                  dbo.transfer_types ON dbo.users.transfer_type_id = dbo.transfer_types.transfer_type_id LEFT OUTER JOIN
                  dbo.banks ON dbo.users.bank_id = dbo.banks.bank_id
WHERE  (dbo.vehicles.transfer_no IS NULL) AND (dbo.users.transfer_no IS NOT NULL) AND (dbo.payments.post_id IS NULL)
