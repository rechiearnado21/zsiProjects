
CREATE VIEW [dbo].[generated_qrs_active_v]
AS
SELECT id, hash_key, is_taken, is_active, balance_amt, consumer_id, ref_trans, created_by, created_date, updated_by, updated_date, expiry_date, hash_key2
FROM     dbo.generated_qrs
WHERE  is_active = 'Y'
