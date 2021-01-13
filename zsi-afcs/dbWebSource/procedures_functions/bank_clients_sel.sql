

CREATE PROCEDURE [dbo].[bank_clients_sel]
(
    @user_id  int = null 
)
AS
BEGIN
      SELECT client_id,client_name FROM dbo.clients_v WHERE is_afcs = 'Y'; 
END

 

 --[bank_clients_sel]