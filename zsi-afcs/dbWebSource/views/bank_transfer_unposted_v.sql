CREATE VIEW dbo.bank_transfer_unposted_v
AS
SELECT        dbo.bank_transfers.*
FROM            dbo.bank_transfers
WHERE        (posted_date IS NULL)
