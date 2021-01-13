

CREATE VIEW [dbo].[load_top_up_v]
AS
SELECT dbo.loading.loading_id, dbo.loading.load_date, dbo.loading.qr_id, dbo.loading.load_amount, dbo.loading.device_id, dbo.loading.load_by, dbo.loading.remit_id, dbo.loading.prev_qr_id, dbo.loading.loading_charge, 
                  dbo.loading.loading_branch_id, dbo.loading.is_top_up, iif(isnull(load_by,0)=0,'PREPAID LOAD',concat(substring(dbo.consumers.first_name,1,1), dbo.consumers.last_name)) store_code, dbo.loading.ref_no
FROM     dbo.loading LEFT OUTER JOIN
                  dbo.consumers ON dbo.loading.load_by = dbo.consumers.consumer_id WHERE dbo.loading.is_top_up='Y'
