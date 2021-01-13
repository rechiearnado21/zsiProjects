CREATE PROCEDURE [dbo].[inactivate_vehicle_sel]
(
       @pkey_ids  VARCHAR(max)
	  ,@is_active CHAR(1)= 'N'
	
)
AS
BEGIN
  SET NOCOUNT ON

  UPDATE zsi_fmis.dbo.vehicles SET is_active = @is_active  WHERE vehicle_id IN (@pkey_ids)


  RETURN @@ROWCOUNT;
 END;





