

CREATE PROCEDURE [dbo].[dd_transfer_type_sel]
(
   @user_id  int = null
)
AS
BEGIN
      SELECT * FROM dbo.transfer_types; 
END



