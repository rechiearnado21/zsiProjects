CREATE PROCEDURE [dbo].[ztokens_sel]
(
    @token_id			INT = null
   ,@user_id			INT = NULL
   ,@cust_id			INT = NULL			
   ,@expiry_date		DATETIME = NULL
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
	SET @stmt = 'SELECT *, CAST(HASHBYTES(''SHA'', CAST(token_id AS nvarchar)) AS varbinary) token_key  FROM dbo.ztokens WHERE 1=1 ';

	IF @token_id <> '' 
	SET @stmt = @stmt + ' AND token_id' + CAST(@token_id AS VARCHAR);

	IF @user_id <> ''
		SET @stmt = @stmt + ' AND user_id'+ CAST(@user_id AS VARCHAR);

	IF @cust_id <> ''
		SET @stmt = @stmt + ' AND cust_id'+ CAST(@cust_id AS VARCHAR);
    
	IF @expiry_date <> ''
		SET @stmt = @stmt + ' AND expiry_date'+ @expiry_date;

 
	exec(@stmt);
 END;


 




