CREATE VIEW dbo.for_bank_transfer_v
AS
SELECT        posted_date, posted_amount, bank_transfer_id, company_code
FROM            dbo.posting_dates
WHERE        (bank_transfer_id IS NULL)
