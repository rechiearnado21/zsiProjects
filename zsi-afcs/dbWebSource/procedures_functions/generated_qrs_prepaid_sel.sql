CREATE procedure [dbo].[generated_qrs_prepaid_sel] (
   @batch_no int = null
  ,@user_id INT = null
)
as
begin
  SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)
  SET @stmt = ' select * from dbo.generated_qrs_prepaid_v '
  if isnull(@batch_no,0) <> 0
     SET @stmt = @stmt + ' WHERE batch_no=' + CAST(@batch_no AS VARCHAR(20))

  EXEC(@stmt);
end

--[dbo].[generated_qrs_prepaid_sel] @batch_no=1