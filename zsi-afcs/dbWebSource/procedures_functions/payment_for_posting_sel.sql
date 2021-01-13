CREATE procedure [dbo].[payment_for_posting_sel]
( 
  @client_id  int 
 ,@vehicle_id int = null
 ,@payment_date DATE = null
 ,@user_id int = null
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt nvarchar(max)='';
  DECLARE @payments_tbl nvarchar(20);
  DECLARE @drivers_v nvarchar(50);
  DECLARE @pao_v nvarchar(50);
  SET @payments_tbl = CONCAT('dbo.payments_',@client_id);
  SET @drivers_v = CONCAT('zsi_hcm.dbo.employees_',@client_id,'_v');
  SET @pao_v = CONCAT('zsi_hcm.dbo.employees_',@client_id,'_v');

  SET @stmt = CONCAT('SELECT pt.payment_date, pt.payment_id, pt.vehicle_id, pt.driver_id, pt.route_id, pt.from_location, pt.to_location, pt.no_klm, pt.no_reg, 
                  pt.no_stu, pt.no_sc, pt.no_pwd, pt.reg_amount, pt.stu_amount, pt.sc_amount, pt.pwd_amount, pt.total_paid_amount, pt.post_id, 
                  dbo.routes_ref.route_code, vh.vehicle_plate_no, pv.id, dv.emp_lfm_name AS driver_name, pv.emp_lfm_name AS pao_name, 
				  pt.client_id, vh.vehicle_type, pt.trip_id
			FROM ',@payments_tbl,' pt INNER JOIN
                  dbo.routes_ref ON pt.route_id = dbo.routes_ref.route_id INNER JOIN
                  dbo.active_vehicles_v AS vh ON pt.vehicle_id = vh.vehicle_id INNER JOIN ',
                  @drivers_v,' dv ON pt.driver_id = dv.id LEFT OUTER JOIN ',
                  @pao_v,' pv ON pt.pao_id = pv.id WHERE (ISNULL(pt.post_id, 0) = 0)')

  IF ISNULL(@vehicle_id,0) <> 0
     SET @stmt = @stmt + ' AND vh.vehicle_id = ' + CAST(@vehicle_id AS VARCHAR(20));

  IF ISNULL(@payment_date,'') <> ''
     SET @stmt = @stmt + ' AND CONVERT(VARCHAR(10),pt.payment_date,101) = ''' + CONVERT(VARCHAR(10),@payment_date,101) + '''';

  EXEC(@stmt);

END
--[dbo].[payment_for_posting_sel] @client_id=1,@vehicle_id=1




