
CREATE PROCEDURE [dbo].[create_payments_tbl] 
   @client_id int
AS
BEGIN  
   SET NOCOUNT ON;

   DECLARE @data_table_name VARCHAR(100);
   DECLARE @create_table_stmt NVARCHAR(max);


   SET @data_table_name = 'payments_' + CAST(@client_id AS VARCHAR);
   
   SET @create_table_stmt = 'CREATE TABLE dbo.' + @data_table_name + ' (' +
	'[payment_id] [int] NOT NULL,'+
	'[payment_date] [datetime] NOT NULL,'+
	'[device_id] [int] NULL,'+
	'[vehicle_id] [int] NULL,'+
	'[pao_id] [int] NULL,'+
	'[driver_id] [int] NULL,'+
	'[inspector_id] [int] NULL,'+
	'[route_id] [int] NULL,'+
	'[from_location] [nvarchar](100) NULL,'+
	'[to_location] [nvarchar](100) NULL,'+
	'[no_klm] [decimal](12, 2) NULL,'+
	'[no_reg] [int] NULL,'+
	'[no_stu] [int] NULL,'+
	'[no_sc] [int] NULL,'+
	'[no_pwd] [int] NULL,'+
	'[reg_amount] [decimal](12, 2) NULL,'+
	'[stu_amount] [decimal](12, 2) NULL,'+
	'[sc_amount] [decimal](12, 2) NULL,'+
	'[pwd_amount] [decimal](12, 2) NULL,'+
	'[total_paid_amount] [decimal](12, 2),'+
	'[qr_id] [int] NULL,'+
	'[qr_ref_no] [nvarchar](50) NULL,'+
	'[post_id] [int] NULL,'+
	'[remit_id] [int] NULL,'+
	'[payment_key] [nvarchar](50) NULL,'+
	'[prev_qr_id] [int] NULL,'+
	'[is_cancelled] [nchar](1) NOT NULL,'+
	'[trip_id] [int] NULL,'+
	'[consumer_id] [int] NULL,'+
	'[base_fare] [decimal](10, 2) NULL,'+
	'[client_id] [int] NULL,'+
	'[start_km] [int] NULL,'+
	'[end_km] [int] NULL,'+
    '[or_no] [nvarchar](20) NULL,'+
	'[is_client_qr] [char](1) NULL,'+
	'[is_open] [char](1) NULL)'
	  
     IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'U' AND name = @data_table_name)
     EXEC (@create_table_stmt);
END;
--[dbo].[create_payments_tbl] @client_id=1
