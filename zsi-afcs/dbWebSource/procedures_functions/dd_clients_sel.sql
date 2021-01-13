 
CREATE PROCEDURE [dbo].[dd_clients_sel]
(
    @user_id  int = null
	,@is_active char(1) = 'Y'
)
AS
BEGIN
      SELECT client_id, client_name FROM zsi_crm.dbo.clients WHERE is_active = @is_active; 
END 
