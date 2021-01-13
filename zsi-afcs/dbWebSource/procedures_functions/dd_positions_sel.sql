CREATE PROCEDURE [dbo].[dd_positions_sel] 
(
	@client_id int
   ,@user_id INT = NULL
)
as
	

begin
   DECLARE @stmt NVARCHAR(MAX);
   SET @stmt = CONCAT('SELECT * from zsi_hcm.dbo.positions_',@client_id,' ORDER BY position_title');
   EXEC(@stmt);
end

