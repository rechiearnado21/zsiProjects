CREATE procedure [dbo].[payment_posting_upd]
(
   @tt  payment_ids_tt READONLY
  ,@user_id INT
)
AS
BEGIN
   declare @post_id int
   declare @client_id int
   declare @ttl_amount DECIMAL(18,2)
   SELECT @client_id=company_id FROM dbo.users where user_id=@user_id;
   INSERT INTO dbo.posting_dates (posted_date,client_id,created_by) values (DATEADD(HOUR,8,GETUTCDATE()),@client_id,@user_id)
   SELECT @post_id = @@IDENTITY
   UPDATE dbo.payments SET post_id = @post_id  WHERE payment_id IN (SELECT payment_id FROM @tt);
   SELECT @ttl_amount = sum(total_paid_amount) FROM dbo.payments WHERE post_id = @post_id GROUP BY post_id;
   UPDATE dbo.posting_dates SET posted_amount = @ttl_amount WHERE id = @post_id; 
   
END

