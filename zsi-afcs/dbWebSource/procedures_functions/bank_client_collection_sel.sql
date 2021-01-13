
CREATE procedure [dbo].[bank_client_collection_sel]
( 
  @user_id int=NULL 
)
AS
BEGIN
  SET NOCOUNT ON  
	SELECT cv.client_id, cv.client_name, SUM(pt.total_paid_amount) AS total_sales
    FROM dbo.clients_v cv INNER JOIN payments_1 pt
    ON cv.client_id=pt.client_id
    GROUP BY cv.client_id, cv.client_name
 
END
--[bank_client_collection_sel]  
