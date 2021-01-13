
CREATE PROCEDURE [dbo].[dd_drivers_sel]
(
   @user_id  int = null
  ,@company_id int 
)
AS
BEGIN
  SELECT user_id, full_name FROM dbo.drivers_v where client_id = @company_id; 
END

 

