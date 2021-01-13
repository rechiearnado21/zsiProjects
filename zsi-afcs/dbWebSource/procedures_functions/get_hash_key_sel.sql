
CREATE PROCEDURE [dbo].[get_hash_key_sel]
(
    @client_id nvarchar(50)
   ,@user_id int
)
AS
BEGIN
	SET NOCOUNT ON
		SELECT hash_key,client_name FROM dbo.clients_v WHERE client_id = @client_id
END

