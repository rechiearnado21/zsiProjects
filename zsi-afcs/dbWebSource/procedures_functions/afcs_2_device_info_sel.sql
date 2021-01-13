
CREATE PROCEDURE [dbo].[afcs_2_device_info_sel]  
(  
   @user_id INT = NULL
   , @serial_no NVARCHAR(50) = ''
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @sql NVARCHAR(MAX);

	SELECT
		[device_id]
		, [company_code]
		, [mac_address]
		, [serial_no]
		, [device_desc]
		, [is_active]
	FROM dbo.devices
	WHERE 1 = 1
	AND LTRIM(RTRIM(UPPER(serial_no))) = LTRIM(RTRIM(UPPER(@serial_no)));
END;