CREATE procedure [dbo].[get_qr_sel](
   @hash_key nvarchar(50) = null
   ,@user_id INT = null
)
as
BEGIN
IF isnull(@hash_key,'') <>''
   select id from dbo.generated_qrs where hash_key=@hash_key;
ELSE
   select min(id) from dbo.generated_qrs where is_taken='N' and is_active='Y'
END;