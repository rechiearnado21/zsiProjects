

CREATE PROCEDURE [dbo].[consumer_image_file_upd](
      @image_filename nvarchar(max)  
	 ,@consumer_id int  
)
AS
BEGIN
SET NOCOUNT ON
update dbo.consumers
set image_filename=@image_filename 
where consumer_id = @consumer_id
END 

--select * from dbo.consumers
