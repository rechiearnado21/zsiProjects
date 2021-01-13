
CREATE PROCEDURE [dbo].[pao_collections_remitted](
   @pao_id INT=null
  ,@remit_date nvarchar(50)=null
  ,@tdate  nvarchar(50)=null
  ,@user_id INT=NULL
  ,@collection_type nvarchar(20)=null
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @co_code nvarchar(20)=null
	DECLARE @stmt NVARCHAR(MAX)

	select @co_code = company_code FROM dbo.users where user_id=@user_id;
	   SET @stmt = 'SELECT * FROM dbo.pao_collections_v WHERE remit_id is not null AND company_code=''' + @co_code + ''''
	   IF ISNULL(@pao_id,0) <> 0
		  SET @stmt = @stmt + ' AND pao_id=' + cast(@pao_id as varchar(20))
	   IF isnull(@collection_type,'') <>''
		  SET @stmt = @stmt + ' AND collection_type = '''+@collection_type+'''';

	   IF isnull(@tdate,'') <>'' and isnull(@remit_date,'') <>''
		  SET @stmt = @stmt + ' AND cast(remit_date AS DATE) between '''+@tdate+''' AND '''+@remit_date+'''';

	 EXEC(@stmt);
  
END;

