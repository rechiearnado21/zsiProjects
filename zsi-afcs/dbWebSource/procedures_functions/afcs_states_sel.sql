


CREATE PROCEDURE [dbo].[afcs_states_sel]  
(  
   @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	SELECT state_id, state_name FROM dbo.states WHERE 1 = 1 ORDER BY state_name;
END;