
CREATE PROCEDURE [dbo].[actual_payments_upd]
(
    @tt    actual_payments_tt READONLY
   ,@user_id int
)
AS 
BEGIN
SET NOCOUNT ON
DECLARE @client_id INT
DECLARE @payments_summ_tbl nvarchar(50);
DECLARE @stmt NVARCHAR(MAX);
SELECT @client_id= company_id FROM dbo.users_v where user_id = @user_id;
SET @payments_summ_tbl = CONCAT('zsi_afcs_client_data.dbo.payments_summ_',@client_id);

CREATE TABLE #payments_tt(
	[payment_summ_id] [int] NULL,
	[payment_date] [datetime] NULL,
	[is_edited] [char](1) NULL,
	[vehicle_plate_no] [nvarchar](100) NULL,
	[vehicle_id] [int] NULL,
	[driver_name] [nvarchar](100) NULL,
	[driver_id] [int] NULL,
	[pao_name] [nvarchar](100) NULL,
	[pao_id] [int] NULL,
	[qr_amt] [decimal](18, 2) NULL,
	[pos_cash_amt] [decimal](18, 2) NULL,
	[shortage_amt] [decimal](10, 2) NULL,
	[excess_amt] [decimal](10, 2) NULL,
	[total_collection_amt] [decimal](18, 2) NULL
)
INSERT INTO #payments_tt SELECT * FROM @tt;

-- Update Process
   SET @stmt = CONCAT('UPDATE a 
		   SET 
			 excess_amt		= b.excess_amt
			,shortage_amt   = b.shortage_amt
			,total_collection_amt = b.total_collection_amt
	   	    ,updated_by				= ',@user_id,'
			,updated_date			= DATEADD(HOUR, 8, GETUTCDATE())
       FROM ',@payments_summ_tbl,' a INNER JOIN #payments_tt b
	     ON a.payment_summ_id = b.payment_summ_id
	     WHERE isnull(b.is_edited,''N'')=''Y''');

   EXEC(@stmt);

-- Insert Process
	SET @stmt = CONCAT('INSERT INTO ',@payments_summ_tbl,' (
		 payment_date					
	    ,vehicle_plate_no	
		,driver_name
		,pao_name
		,vehicle_id
		,driver_id
		,pao_id
		,qr_amt
		,pos_cash_amt
		,excess_amt
		,shortage_amt
		,total_collection_amt 
		,created_by
		,created_date
    )
	SELECT  
		 payment_date		
		,vehicle_plate_no
		,driver_name
		,pao_name
		,vehicle_id
		,driver_id
		,pao_id
		,qr_amt
		,pos_cash_amt
		,excess_amt
		,shortage_amt
		,total_collection_amt  
		,',@user_id,'
		,DATEADD(HOUR, 8, GETUTCDATE())
	FROM #payments_tt
	WHERE ISNULL(payment_summ_id,0)=0
	AND payment_date IS NOT NULL')
EXEC(@stmt);
END;
