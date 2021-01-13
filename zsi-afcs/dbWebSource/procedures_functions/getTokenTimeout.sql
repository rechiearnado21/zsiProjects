
create FUNCTION [dbo].[getTokenTimeout]() 
RETURNS INT 
AS
BEGIN
   DECLARE @token_timeout int
	SELECT @token_timeout=token_timeout  FROM app_profile 
    RETURN @token_timeout;

END;

