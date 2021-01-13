CREATE procedure [dbo].[generated_qrs_sel] (
   @qr_id int = null
  ,@user_id INT = null
)
as
begin
  SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)
  SET @stmt = ' select * from dbo.generated_qrs where 1=1 '
  if isnull(@qr_id,0) <> 0
     SET @stmt = @stmt + 'AND id=' + CAST(@qr_id AS VARCHAR(20))

  EXEC(@stmt);
end