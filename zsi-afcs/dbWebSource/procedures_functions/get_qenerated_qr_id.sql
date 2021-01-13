CREATE PROCEDURE [dbo].[get_qenerated_qr_id]
 (@hash_key NVARCHAR(MAX)
 ,@user_id int = null)
AS
BEGIN
  SELECT id FROM dbo.generated_qr_top_not_taken_v WHERE hash_key = @hash_key;
END
