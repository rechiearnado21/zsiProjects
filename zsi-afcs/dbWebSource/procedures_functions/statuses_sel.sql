
CREATE PROCEDURE [dbo].[statuses_sel](
 @user_id int
,@status_code char(1)=NULL
)
 AS
 BEGIN
 DECLARE @isAdmin CHAR(1)='N'

SELECT @isAdmin = is_admin FROM dbo.users WHERE user_id=@user_id 

	IF ISNULL(@isAdmin,'N') = 'Y' 
	BEGIN
		IF @status_code = 'N'
			SELECT status_code, status_desc,status_color FROM statuses WHERE status_code IN ('N','S','C')

		IF @status_code = 'A'
			SELECT status_code, status_desc,status_color FROM statuses WHERE status_code IN ('C','A')

		IF @status_code = 'S'
			SELECT status_code, status_desc,status_color FROM statuses WHERE status_code IN ('S','C','A')
	END
	ELSE
	BEGIN
   		IF @status_code = 'N'
			SELECT status_code, status_desc,status_color FROM statuses WHERE status_code IN ('N','S','C')

		IF @status_code = 'S'
			SELECT status_code, status_desc,status_color FROM statuses WHERE status_code IN ('S')

		IF @status_code = 'A'
			SELECT status_code, status_desc,status_color FROM statuses WHERE status_code IN ('A')
	END
END







