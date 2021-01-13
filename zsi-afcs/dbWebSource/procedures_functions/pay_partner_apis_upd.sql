

CREATE procedure [dbo].[pay_partner_apis_upd](
   @api_id  int=null
  ,@pay_partner_id  int=null
  ,@api_name varchar(200)=null
  ,@api_url varchar(max)=null
  ,@user_id   int=null
)
as
BEGIN
   SET NOCOUNT ON
	 IF ISNULL(@api_id,0)=0
		INSERT INTO dbo.pay_partner_apis
		 (
		  pay_partner_id
		 ,api_name
		 ,api_url 
		 ,created_by
		 ,created_date
		 ) VALUES
		 (
		  @pay_partner_id
		 ,@api_name
		 ,@api_url
		 ,@user_id
		 ,GETDATE()
		 ) 

	ELSE
	   UPDATE dbo.pay_partner_apis SET
			    pay_partner_id		= @pay_partner_id
			   ,api_name			= @api_name
			   ,api_url				= @api_url
			   ,updated_by			= @user_id
			   ,updated_date		= GETDATE();
END;


