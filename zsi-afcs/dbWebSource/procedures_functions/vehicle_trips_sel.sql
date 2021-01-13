CREATE PROCEDURE [dbo].[vehicle_trips_sel](  
   @client_id  INT 
  ,@vehicle_id INT=NULL  
  ,@driver_id  INT=NULL 
  ,@pao_id  INT=NULL   
  ,@pdate_from DATE=null
  ,@pdate_to   DATE=null 
  ,@col_no           int=5
  ,@order_no         int=1
  ,@user_id    INT = NULL
    
  
)  
AS  
BEGIN  
SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX) = NULL
DECLARE @vehicle_trip_tbl NVARCHAR(100)
DECLARE @driver_v NVARCHAR(100)
DECLARE @pao_v NVARCHAR(100)
DECLARE @cur_date DATE  = CONVERT(DATE,DATEADD(HOUR,8,GETUTCDATE()),101);
DECLARE @orderby    VARCHAR(5);

SET @orderby = IIF(@order_no = 0, ' ASC',' DESC') 
SET @vehicle_trip_tbl = CONCAT('dbo.vehicle_trips_',@client_id)
SET @driver_v = CONCAT('zsi_hcm.dbo.employees_',@client_id,'_v')
SET @pao_v = CONCAT('zsi_hcm.dbo.employees_',@client_id,'_v')

SELECT @stmt = CONCAT('SELECT vv.vehicle_plate_no, dv.emp_lfm_name  AS driver_name, pv.emp_lfm_name AS pao_name, vt.* 
                       FROM ',@vehicle_trip_tbl ,' vt INNER JOIN ' ,@driver_v,' dv ON vt.driver_id = dv.id
			           INNER JOIN dbo.active_vehicles_v vv ON vt.vehicle_id = vv.vehicle_id LEFT OUTER JOIN ',
                       @pao_v ,' pv ON vt.pao_id = pv.id WHERE 1=1 ')

IF ISNULL(@pdate_from,'') = '' AND ISNULL(@pdate_to,'')=''  
   SET @stmt =CONCAT(@stmt,' AND CONVERT(DATE, vt.start_date,101)= ''',@cur_date,'''')  
ELSE  
   SET @stmt = CONCAT(@stmt,' AND CONVERT(DATE, vt.start_date,101) BETWEEN ''', @pdate_from, ''' AND ''', @pdate_to , '''');  


IF ISNULL(@vehicle_id,0)<>0  
   SET @stmt = CONCAT(@stmt + ' AND vt.vehicle_id = ',@vehicle_id)  

IF ISNULL(@pao_id,0)<>0  
   SET @stmt = CONCAT(@stmt + ' AND pv.id = ',@pao_id)   

IF ISNULL(@driver_id,0)<>0  
   SET @stmt = CONCAT(@stmt + ' AND dv.id = ',@driver_id)  
    
 SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no as varchar(20))

	IF isnull(@order_no,0) <> 0
	   SET @stmt = @stmt + ' DESC'
     ELSE
	   SET @stmt = @stmt + ' ASC'

PRINT(@stmt)
EXEC(@stmt);  
END  
 
 --vehicle_trips_sel @client_id=1