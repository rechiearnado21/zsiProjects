
CREATE PROCEDURE [dbo].[remittance_company_list_sel] (
   @remit_id int
)
AS
BEGIN
   SELECT company_name, bank_name, account_no, SUM(total_paid_amount) remit_amount
     FROM dbo.remittance_per_company_unposted_v
	 WHERE remit_id = @remit_id
	 GROUP BY company_name, bank_name, account_no

END
