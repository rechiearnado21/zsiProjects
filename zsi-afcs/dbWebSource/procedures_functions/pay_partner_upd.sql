
CREATE PROCEDURE [dbo].[pay_partner_upd]
(
    @tt    pay_partner_tt READONLY
   ,@user_id int
   ,@id	INT=NULL 
)
AS
-- Update Process
	UPDATE a 
		   SET  
			 partner_name			= b.partner_name
			,client_id				= b.client_id
			,client_secret			= b.client_secret
			,merchant				= b.merchant  		
	   	    ,updated_by				= @user_id
			,updated_date			= GETDATE()

       FROM dbo.pay_partner a INNER JOIN @tt b
	     ON a.pay_partner_id = b.pay_partner_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
			and b.partner_name IS NULL
	        and b.client_id IS NOT NULL
	        and b.client_secret IS NOT NULL
			and b.merchant IS NOT NULL
		);
-- Insert Process
BEGIN
	INSERT INTO pay_partner(
		 partner_name
		,client_id		
		,client_secret
		,merchant  
		,created_by
		,created_date
    )
	SELECT 
		 partner_name
		,client_id		
		,client_secret  
		,merchant 
	    ,@user_id
	    , GETDATE()  
		
	FROM @tt  
	WHERE pay_partner_id IS NULL
		And partner_name IS NOT NULL
		And client_id IS NOT NULL
		And client_secret IS NOT NULL
		And merchant IS NOT NULL
END
BEGIN
	SET @id = @@IDENTITY
END

RETURN @id;

	 




