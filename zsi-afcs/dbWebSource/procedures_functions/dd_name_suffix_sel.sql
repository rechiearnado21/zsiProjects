


CREATE PROCEDURE [dbo].[dd_name_suffix_sel]
(
   @user_id  int = null
)
AS
BEGIN
      SELECT name_suffix FROM dbo.name_suffixes; 
END




