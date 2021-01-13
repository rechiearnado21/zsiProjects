

CREATE PROCEDURE [dbo].[loading_branch_deposits_sel]
(
    @user_id  int = null 
   ,@searchVal VARCHAR(50) = null
   ,@loading_branch_id int=null
)
AS
BEGIN
	SET NOCOUNT ON 
	DECLARE @stmt nvarchar(max)=''; 
		SET @stmt = 'SELECT * FROM dbo.loading_branch_deposits WHERE 1=1'; 

		IF  ISNULL(@loading_branch_id,0) <> 0
	    SET @stmt = @stmt + ' AND loading_branch_id ='+ cast(@loading_branch_id as varchar(20));

		IF isnull(@searchVal,'') <>''
		SET @stmt = @stmt + ' AND deposit_ref_no like ''%'+@searchVal+'%''';
	EXEC(@stmt);
END


