CREATE procedure [dbo].[generated_qr_upd](
   @hash_key  nvarchar(100)=null
  ,@amount    decimal(10,2)
  ,@device_id int=null
  ,@user_id   int
  ,@id     int=0 output
)
as
BEGIN
   SET NOCOUNT ON
   DECLARE @lhash_key nvarchar(100)
   DECLARE @bal_amt decimal(18,2)
  IF isnull(@hash_key,'')='' 
  BEGIN
     SELECT @id = min(id), @lhash_key=hash_key FROM dbo.generated_qrs where is_taken='N' and is_active='Y' GROUP BY id, hash_key;
	 UPDATE dbo.generated_qrs 
	    SET balance_amt = @amount
	       ,is_taken = 'Y'
		   ,created_by = @user_id
		   ,created_date = DATEADD(HOUR, 8, GETUTCDATE())
     WHERE id=@id; 
	 
	 INSERT INTO dbo.loading (load_date,qr_id, load_amount, device_id, load_by) 
	      values (DATEADD(HOUR, 8, GETUTCDATE()),@id, @amount,@device_id, @user_id)
  END
  ELSE
  BEGIN
     SELECT @id=id, @bal_amt = balance_amt + @amount FROM dbo.generated_qrs where hash_key=@hash_key and is_active='Y'
	 IF isnull(@id,0) <> 0
	 BEGIN
		 UPDATE dbo.generated_qrs 
			SET balance_amt = balance_amt + @amount
			   ,updated_by = @user_id
			   ,updated_date = DATEADD(HOUR, 8, GETUTCDATE())
		 WHERE id=@id; 

	 INSERT INTO dbo.loading (load_date,qr_id, load_amount, device_id, load_by) 
	      values (DATEADD(HOUR, 8, GETUTCDATE()),@id, @amount,@device_id, @user_id)
     END

  END;
  RETURN @id;
END;

--select * from generated_qrs