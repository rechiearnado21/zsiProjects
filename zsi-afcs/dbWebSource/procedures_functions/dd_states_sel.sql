

CREATE PROCEDURE [dbo].[dd_states_sel]
(
     @user_id  int = null
	,@country_id int = null
)
AS
BEGIN
      SELECT state_id, state_name FROM dbo.states ORDER BY state_name; 
END



