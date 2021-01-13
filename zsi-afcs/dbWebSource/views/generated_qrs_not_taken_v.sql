CREATE VIEW dbo.generated_qrs_not_taken_v
AS
SELECT dbo.generated_qrs.*
FROM     dbo.generated_qrs
WHERE  (is_taken = 'N')
