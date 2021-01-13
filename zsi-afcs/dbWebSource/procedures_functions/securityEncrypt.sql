
CREATE FUNCTION [dbo].[securityEncrypt](
	@string VARCHAR(100)
) 
RETURNS VARBINARY(200) 
AS
BEGIN
	DECLARE @encrypt VARBINARY(200);

	SELECT @encrypt = EncryptByPassPhrase('zetta', @string);
	RETURN @encrypt;
END;