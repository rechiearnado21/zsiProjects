
CREATE VIEW [dbo].[pao_collections_v]
AS
SELECT        pao_collections.id, pao_collections.tdate, pao_collections.amount, pao_collections.pao, pao_collections.pao_id, pao_collections.company_code, pao_collections.collection_type, pao_collections.remit_id, 
                         dbo.remit_dates.remit_date
FROM            (SELECT        payment_id AS id, payment_date AS tdate, total_paid_amount AS amount, pao_id, pao, company_code, 'FARE' AS collection_type, remit_id
                          FROM            dbo.payments_v
                          WHERE        (payment_type = 'CASH')
                          UNION
                          SELECT        loading_id AS id, load_date AS tdate, load_amount AS amount, load_by AS pao_id, loaded_by AS pao, company_code, 'LOAD' AS collection_type, remit_id
                          FROM            dbo.loading_v) AS pao_collections INNER JOIN
                         dbo.users ON pao_collections.pao_id = dbo.users.user_id LEFT OUTER JOIN
                         dbo.remit_dates ON pao_collections.remit_id = dbo.remit_dates.id
WHERE        (dbo.users.role_id = 2)
