
CREATE PROCEDURE [dbo].[ztokens_upd] (
	 @token_key					nvarchar(max) = null
	,@user_id                   INT = null
	,@cust_id					INT = null
	,@new_token					varbinary(max) = null OUTPUT 
	)
	AS
BEGIN
    IF NOT @token_key IS NULL	 
		BEGIN
			UPDATE dbo.ztokens
			SET  user_id 		  =	@user_id				
				,cust_id		  =	@cust_id					
				,expiry_interval   = dbo.getTokenTimeout() 			
			 WHERE  HASHBYTES('SHA', CAST(token_id AS nvarchar))  = @token_key;
			 SET @new_token = CAST(@token_key as varbinary)
		END			
   BEGIN
		INSERT INTO dbo.ztokens (
		 user_id				
		,cust_id				
		,expiry_interval	
		,created_date
		)
		values
		( @user_id			
		 ,@cust_id		
		 ,dbo.getTokenTimeout() 	
		 ,DATEADD(HOUR, 8, GETUTCDATE())
		)
		print @@IDENTITY 
		SET  @new_token = HASHBYTES('SHA', CAST(@@IDENTITY AS nvarchar))  
    end
	print  @new_token;
	RETURN @new_token;
END;

