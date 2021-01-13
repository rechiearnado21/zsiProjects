
CREATE VIEW [dbo].[remittance_per_company_unposted_v]
AS
SELECT dbo.payments.payment_date, dbo.payments.total_paid_amount, dbo.vehicles.vehicle_plate_no, dbo.company_info.company_name, dbo.banks.bank_name, dbo.company_info.account_no, CONVERT(VARCHAR(10), 
                  dbo.payments.payment_date, 120) AS pdate, dbo.payments.post_id,dbo.payments.remit_id
FROM     dbo.payments INNER JOIN
                  dbo.vehicles ON dbo.payments.vehicle_id = dbo.vehicles.vehicle_id INNER JOIN
                  dbo.users ON dbo.payments.driver_id = dbo.users.user_id INNER JOIN
                  dbo.company_info ON dbo.vehicles.company_id = dbo.company_info.company_id INNER JOIN
                  dbo.banks ON dbo.company_info.bank_id = dbo.banks.bank_id
WHERE  (dbo.users.transfer_no IS NULL) AND (dbo.payments.post_id IS NULL) AND (dbo.vehicles.transfer_no IS NULL)
