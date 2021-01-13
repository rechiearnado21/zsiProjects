CREATE VIEW dbo.bank_tranfers_posted_v
AS
SELECT        dbo.bank_transfers.bank_transfer_id, dbo.bank_transfers.bank_transfer_date, dbo.bank_transfers.bank_id, dbo.bank_transfers.bank_ref_no, dbo.bank_transfers.company_code, dbo.bank_transfers.transferred_amount, 
                         dbo.bank_transfers.posted_date, dbo.bank_transfers.created_by, dbo.bank_transfers.created_date, dbo.bank_transfers.updated_by, dbo.bank_transfers.updated_date, dbo.banks.bank_code
FROM            dbo.bank_transfers INNER JOIN
                         dbo.banks ON dbo.bank_transfers.bank_id = dbo.banks.bank_id
WHERE        (dbo.bank_transfers.posted_date IS NOT NULL)
