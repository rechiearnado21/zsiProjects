
CREATE FUNCTION [dbo].[securityDecrypt](
	@encrypt VARBINARY(200)
) 
RETURNS VARCHAR(100)
AS
BEGIN
	DECLARE @decrypt VARCHAR(100);

	SELECT @decrypt = CONVERT(VARCHAR(100), DecryptByPassPhrase('zetta', @encrypt));
	RETURN @decrypt;
END;