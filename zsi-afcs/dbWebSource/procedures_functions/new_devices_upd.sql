CREATE PROCEDURE [dbo].[new_devices_upd](
   @client_id int
  ,@no_devices int
)
AS
BEGIN
DECLARE @ctr int = 0
WHILE @ctr < @no_devices
BEGIN
  INSERT INTO dbo.devices (company_id,hash_key,is_active, created_by, created_date) values (@client_id, newid(),'N',1,DATEADD(HOUR,8,GETUTCDATE()));
  SET @ctr = @ctr + 1;
END
SELECT CONCAT(@ctr, ' new devices for registration were added succesfully!') as msg;
END

