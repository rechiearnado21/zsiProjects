CREATE procedure [dbo].[payment_recent_summ_sel]  
(   
  @client_id  int
 ,@vehicle_id int = null
 ,@order_no   int = 1  
 ,@col_no	 INT = 9
 ,@user_id    int = null  
)  
AS  
BEGIN  
  SET NOCOUNT ON  
  DECLARE @stmt VARCHAR(MAX)  
  DECLARE @payments_tbl nvarchar(20);
  DECLARE @payments_summ_tbl nvarchar(50);
  DECLARE @orderby VARCHAR(100) = ' ASC';
  DECLARE @driver_v nvarchar(50);
  DECLARE @pao_v nvarchar(50); 
  DECLARE @hour int;
  DECLARE @cdate DATE;
  SELECT @hour = add_hour from dbo.app_profile
  SELECT @cdate = DATEADD(HOUR,@hour,GETUTCDATE())
  SET @payments_tbl = CONCAT('dbo.payments_',@client_id);
  SET @payments_summ_tbl = CONCAT('zsi_afcs_client_data.dbo.payments_summ_',@client_id);
  SET @driver_v = CONCAT('zsi_hcm.dbo.employees_',@client_id,'_v');
  SET @pao_v = CONCAT('zsi_hcm.dbo.employees_',@client_id,'_v'); 

  CREATE TABLE #collection_summ (   
       payment_date date
	 , cash_sales decimal(10,2)
	 , qr_sales decimal(10,2)
	 , excess_amt decimal(10,2)
	 , shortage_amt decimal(10,2)
	 , total_sales decimal(10,2)
	 , vehicle_plate_no varchar(20)
	 , vehicle_id int
	 , driver_name nvarchar(100)
	 , driver_id  int
	 , pao_name  nvarchar(100)
	 , pao_id  int
	 , payment_summ_id int
  )

  SET @stmt = CONCAT('SELECT ''', @cdate,''' payment_date,  cash_sales, qr_sales, 0, 0, cash_sales + qr_sales  as total_sales, vehicle_plate_no, vehicle_id, driver_name,driver_id, pao_name,pao_id,0 FROM (
					  SELECT sum(total_paid_amount) cash_sales, 0 qr_sales, vh.vehicle_plate_no, vh.vehicle_id,
					  dv.emp_lfm_name driver_name,dv.id driver_id, pv.emp_lfm_name pao_name,pv.id pao_id FROM ', @payments_tbl, ' pt 
					  INNER JOIN
					  dbo.active_vehicles_v AS vh ON pt.vehicle_id = vh.vehicle_id INNER JOIN ',
					  @driver_v,' dv ON pt.driver_id = dv.id LEFT OUTER JOIN ',
					  @pao_v,' pv ON pt.pao_id = pv.id
					  WHERE ISNULL(qr_id,0)=0 AND CONVERT(DATE,payment_date) = ''',@cdate,'''
					  GROUP BY vh.vehicle_plate_no, vh.vehicle_id, dv.emp_lfm_name,dv.id, pv.emp_lfm_name,pv.id
				  UNION
					  SELECT 0 cash_sales, sum(total_paid_amount) qr_sales, vh.vehicle_plate_no, vh.vehicle_id,
					  dv.emp_lfm_name driver_name,dv.id driver_id, pv.emp_lfm_name pao_name,pv.id pao_id FROM ', @payments_tbl, ' pt 
					  INNER JOIN
					  dbo.active_vehicles_v AS vh ON pt.vehicle_id = vh.vehicle_id INNER JOIN ',
					  @driver_v,' dv ON pt.driver_id = dv.id LEFT OUTER JOIN ',
					  @pao_v,' pv ON pt.pao_id = pv.id
					  WHERE ISNULL(qr_id,0)<>0 AND CONVERT(DATE,payment_date) = ''',@cdate,'''
					  GROUP BY vh.vehicle_plate_no, vh.vehicle_id, dv.emp_lfm_name,dv.id, pv.emp_lfm_name,pv.id
				  ) x ');

 INSERT INTO #collection_summ EXEC(@stmt)

 SET @stmt = CONCAT('UPDATE a SET total_sales = b.total_collection_amt, 
      excess_amt = b.excess_amt, 
	  shortage_amt = b.shortage_amt, 
	  payment_summ_id = b.payment_summ_id
      FROM #collection_summ a,',@payments_summ_tbl ,' b 
      WHERE a.payment_date = b.payment_date 
	  and b.payment_date =''', @cdate,'''
	  and a.vehicle_id = b.vehicle_id  
	  and a.driver_id = b.driver_id 
	  and a.pao_id = b.pao_id');

EXEC(@stmt);

 SET @stmt= 'SELECT * FROM #collection_summ '

 IF ISNULL(@vehicle_id,0)<>0  
     SET @stmt = CONCAT(@stmt,' WHERE vehicle_id = ',@vehicle_id) 
  
  SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no as varchar(20));
  
	IF isnull(@order_no,0) <> 0
	   SET @stmt = @stmt + ' DESC'
     ELSE
	   SET @stmt = @stmt + ' ASC'
   

  EXEC(@stmt);   
END  
--[dbo].[payment_recent_summ_sel] @client_id=1 ,_id=1119 @vehicle_id=1  ,@driver



