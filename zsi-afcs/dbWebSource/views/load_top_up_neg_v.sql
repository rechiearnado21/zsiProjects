




CREATE VIEW [dbo].[load_top_up_neg_v]
AS
SELECT dbo.loading.loading_id, dbo.loading.load_date, (dbo.loading.load_amount * -1) load_amount, dbo.loading.load_by,
concat(substring(ct.first_name,1,1), ct.last_name) store_code, cf.qr_id cqr_id, dbo.loading.ref_no
FROM     dbo.loading INNER JOIN
				  dbo.consumers cf ON dbo.loading.load_by = cf.consumer_id INNER JOIN
				  dbo.consumers ct ON dbo.loading.qr_id = ct.qr_id WHERE dbo.loading.is_top_up='Y' 
