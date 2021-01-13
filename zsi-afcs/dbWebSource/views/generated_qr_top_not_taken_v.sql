CREATE VIEW dbo.generated_qr_top_not_taken_v
AS
SELECT TOP (1) id, hash_key, is_taken, is_active, is_loaded, balance_amt, consumer_id, ref_trans, created_by, created_date, updated_by, updated_date, expiry_date, hash_key2
FROM     dbo.generated_qrs
WHERE  (is_taken = 'N') AND (ISNULL(consumer_id, 0) = 0) AND (ISNULL(is_prepaid, 'N') = 'N') AND (balance_amt = 0)
