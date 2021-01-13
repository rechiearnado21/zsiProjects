
CREATE PROCEDURE [dbo].[remittance_vehicle_list_sel] (
   @remit_id int
)
AS
BEGIN
   SELECT account_name, transfer_to, account_no, transfer_type_id, SUM(total_paid_amount) remit_amount
     FROM dbo.remittance_per_vehicle_unposted_v
	 WHERE remit_id = @remit_id
	 GROUP BY account_name, transfer_to, account_no, transfer_type_id
	 ORDER BY transfer_type_id
END

