


CREATE PROCEDURE [dbo].[barangays_sel]
(
    @state_id  INT = null
   ,@user_id INT = NULL
   ,@search_val nvarchar(100)=null
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.barangays WHERE 1=1 ';

	IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND barangay_name like ''%' + @search_val  + '%'' or barangay_code like ''%' + @search_val  + '%'' or barangay_sname like ''%' + @search_val  + '%'''
	
	IF  ISNULL(@state_id,0) <> 0
	    SET @stmt = @stmt + ' AND state_id ='+ cast(@state_id as varchar(20));

	exec(@stmt);
 END;


