CREATE VIEW dbo.fare_matrix_v
AS
SELECT dbo.fare_matrix.*, dbo.transport_groups.transport_group
FROM     dbo.fare_matrix INNER JOIN
                  dbo.transport_groups ON dbo.fare_matrix.transport_group_id = dbo.transport_groups.transport_group_id
