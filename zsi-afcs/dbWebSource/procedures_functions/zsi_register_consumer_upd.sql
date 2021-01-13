
 
CREATE PROCEDURE [dbo].[zsi_register_consumer_upd]  
(  
     @mobile_no nvarchar(20)=null
   , @email NVARCHAR(100)=NULL
   , @first_name NVARCHAR(300)
   , @middle_name NVARCHAR(300)=NULL
   , @last_name NVARCHAR(300)
   , @password NVARCHAR(50)=NULL
   , @birthdate DATE = NULL 
   , @image_file NVARCHAR(MAX)
   , @address NVARCHAR(300) = null
   , @city_id int = null
   , @state_id int = null
   , @country_id int = null
   , @qr_id int = null
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON; 
	DECLARE @stmt		VARCHAR(4000);
	DECLARE @cur_date DATETIME = DATEADD(HOUR,8,GETUTCDATE()) 
	DECLARE @id int
	IF ISNULL(@qr_id,0) = 0
	   SELECT @qr_id = id FROM dbo.generated_qr_top_not_taken_v;
	
	BEGIN  
		INSERT INTO zsi_afcs.[dbo].[consumers]
			( is_active
			, hash_key
			, first_name
			, middle_name
			, last_name
			, address
			, city_id
			, state_id
			, country_id 
			, birthdate 
			, image_filename 
			, email
			, mobile_no
			, qr_id
			, [password] 
			, created_by
			, created_date   
		)
		VALUES
			( 'N'
			, newid()
			, @first_name
			, @middle_name
			, @last_name
			, @address
			, @city_id
			, @state_id
			, @country_id
			, IIF(@birthdate = '', NULL, @birthdate)  
			, CAST(N'' AS xml).value('xs:base64Binary(sql:variable("@image_file"))', 'varbinary(max)') 
			, @email
			, @mobile_no
			, @qr_id
			, zsi_afcs.dbo.securityEncrypt(@password) 
			, @user_id
			, @cur_date   

		);  

		SET @id =  @@identity;

		RETURN @id;
	END 
END;