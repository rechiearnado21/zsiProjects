CREATE VIEW dbo.generated_qrs_prepaid_v
AS
SELECT id, hash_key, is_taken, is_active, is_loaded, balance_amt, consumer_id, ref_trans, created_by, created_date, updated_by, updated_date, expiry_date, hash_key2, batch_no
FROM     dbo.generated_qrs
WHERE  (is_taken = 'N') AND (is_active = 'Y') AND (ISNULL(consumer_id, 0) = 0) AND (is_prepaid = 'Y')
