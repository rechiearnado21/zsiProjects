

CREATE PROCEDURE [dbo].[create_payments_sum_tbl] 
   @client_id int
AS
BEGIN  
   SET NOCOUNT ON;

   DECLARE @data_table_name VARCHAR(100);
   DECLARE @create_table_stmt NVARCHAR(max);


   SET @data_table_name = 'payment_summ_' + CAST(@client_id AS VARCHAR);
   
   SET @create_table_stmt = 'CREATE TABLE dbo.' + @data_table_name + ' (' +
	'[payment_summ_id] [int] IDENTITY(1,1) NOT NULL,'+
	'[payment_date] [datetime] NULL,'+
	'[vehicle_id] [int] NULL,'+
	'[driver_id] [int] NULL,'+
	'[pao_id] [int] NULL,'+
	'[qr_amt] [decimal](18, 2) NULL,'+
	'[pos_cash_amt] [decimal](18, 2) NULL,'+
	'[actual_cash_amt] [decimal](18, 2) NULL,'+
	'[total_collection_amt] [decimal](18, 2) NULL,'+
	'[updated_by] [int] NULL,'+
	'[updated_date] [datetime] NULL,'+
'CONSTRAINT [PK_'+ @data_table_name + '] PRIMARY KEY CLUSTERED 
(
	[payment_summ_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'
     EXEC (@create_table_stmt);
END;
--[dbo].[create_payments_sum_tbl] @client_id=1
