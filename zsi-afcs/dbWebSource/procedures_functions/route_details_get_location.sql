CREATE procedure [dbo].[route_details_get_location]
(  
     @lng varchar(100) 
    ,@lat varchar(100)
   , @user_id INT = NULL
)  
AS  

 select top 1 location  from route_details 
where (geometry::STPointFromText(CONCAT('Point(',@lng,' ',@lat,')'),0)).STWithin(map_area)=1

