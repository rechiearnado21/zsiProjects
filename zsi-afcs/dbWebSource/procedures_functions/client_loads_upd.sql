CREATE PROCEDURE [dbo].[client_loads_upd] (
  @client_load_id   int = null
 ,@client_id   int = null
 ,@load_date  datetime = null
 ,@load_amount decimal(10,2)
 ,@ref_no nvarchar(20)
 ,@loaded_by int = null
 ,@transfer_type_id int = null
 ,@transfer_ref_no nvarchar(20) 
 ,@id INT=NULL OUTPUT  
 ,@user_id int = null
)
AS
BEGIN
  SET @id = @client_load_id
  IF ISNULL(@client_load_id,0)=0
  BEGIN 
	  INSERT INTO dbo.client_loads
	  ( client_id
	   ,load_date
	   ,load_amount
	   ,ref_no
	   ,loaded_by
	   ,transfer_type_id
	   ,transfer_ref_no
	   )VALUES 
	   (
		 @client_id
		 ,@load_date
		 ,@load_amount
		 ,'ZM' + CAST(RAND() * 1000000 AS VARCHAR(6))
		 ,USER_ID()
		 ,@transfer_type_id
		 ,@transfer_ref_no
	   );
	   SET @id = @@IDENTITY 
	   RETURN @id;
   END
ELSE
   UPDATE dbo.client_loads SET
          client_id       = @client_id  
		 ,load_date       = @load_date
		 ,load_amount	  = @load_amount   
		 ,loaded_by		  = USER_ID()
		 ,transfer_type_id= @transfer_type_id
		 ,transfer_ref_no = @transfer_ref_no;
		    
END;


