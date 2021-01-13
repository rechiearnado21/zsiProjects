CREATE procedure [dbo].[payment_recent_sel]  
(   
  @client_id  int 
 ,@vehicle_id int = null  
 ,@driver_id  int = null 
 ,@pao_id int = null 
 ,@user_id    int = null  
 ,@col_no     int=5
 ,@order_no   int=1
)  
AS  
BEGIN  
  SET NOCOUNT ON  
  DECLARE @stmt VARCHAR(MAX)  
  DECLARE @vehicle_trip_tbl NVARCHAR(100)
  DECLARE @payments_tbl nvarchar(20);
  DECLARE @drivers_v nvarchar(50);
  DECLARE @pao_v nvarchar(50);
  SET @vehicle_trip_tbl = CONCAT('dbo.vehicle_trips_',@client_id)
  SET @payments_tbl = CONCAT('dbo.payments_',@client_id);
  SET @drivers_v = CONCAT('zsi_hcm.dbo.employees_',@client_id,'_v');
  SET @pao_v = CONCAT('zsi_hcm.dbo.employees_',@client_id,'_v');

  SET @stmt = CONCAT('SELECT vt.trip_no, vh.vehicle_plate_no, dv.emp_lfm_name driver_name, pv.emp_lfm_name pao_name, FORMAT(pt.payment_date, ''MM-dd-yyyy hh:mm:ss tt'') as payment_date 
                  ,base_fare,from_location,to_location,no_klm,no_reg,no_stu,no_sc,no_pwd,reg_amount,stu_amount,sc_amount,pwd_amount,total_paid_amount, pt.driver_id, pt.pao_id
                  FROM ', @payments_tbl, ' pt INNER JOIN
                  dbo.active_vehicles_v AS vh ON pt.vehicle_id = vh.vehicle_id INNER JOIN ',
                  @drivers_v,' dv ON pt.driver_id = dv.id LEFT OUTER JOIN ',
                  @pao_v,' pv ON pt.pao_id = pv.id LEFT OUTER JOIN ',
				  @vehicle_trip_tbl, ' vt ON vt.trip_id = pt.trip_id 
				  WHERE CONVERT(DATE,payment_date,101)=CONVERT(DATE,DATEADD(HOUR, 8, GETUTCDATE()),101)')
  

  IF ISNULL(@vehicle_id,0)<>0  
     SET @stmt = CONCAT(@stmt,' AND vh.vehicle_id = ',@vehicle_id)  

  IF ISNULL(@pao_id,0)<>0  
     SET @stmt = CONCAT(@stmt,' AND pt.pao_id = ',@pao_id)  
    
  IF ISNULL(@driver_id,0)<>0  
     SET @stmt = CONCAT(@stmt,' AND pt.driver_id = ',@driver_id)  

   
  SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no as varchar(20));
  
	IF isnull(@order_no,0) <> 0
	   SET @stmt = @stmt + ' DESC'
     ELSE
	   SET @stmt = @stmt + ' ASC'
   
  print @stmt;
  EXEC(@stmt);  
END  
--[dbo].[payment_recent_sel] @client_id=1 ,@vehicle_id=1  ,@driver_id=1119 
