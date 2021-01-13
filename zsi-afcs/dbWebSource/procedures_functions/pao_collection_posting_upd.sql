
CREATE procedure [dbo].[pao_collection_posting_upd]
(
   @tt  remit_ids_tt READONLY
  ,@user_id INT
  
)
AS
BEGIN
   SET NOCOUNT ON
   declare @remit_id int
   declare @co_code nvarchar(20)
   SELECT @co_code=company_code FROM dbo.users where user_id=@user_id;
   INSERT INTO dbo.remit_dates (remit_date,company_code,created_by) values (DATEADD(HOUR, 8, GETUTCDATE()),@co_code,@user_id)
   SELECT @remit_id = @@IDENTITY
   UPDATE dbo.payments SET remit_id = @remit_id  WHERE payment_id IN (SELECT id FROM @tt where collection_type = 'FARE');
   UPDATE dbo.loading SET remit_id = @remit_id  WHERE loading_id IN (SELECT id FROM @tt where collection_type = 'LOAD');
END
