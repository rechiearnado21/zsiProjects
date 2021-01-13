

CREATE PROCEDURE [dbo].[create_loading_tbl] 
   @client_id int
AS
BEGIN  
   SET NOCOUNT ON;

   DECLARE @data_table_name VARCHAR(100);
   DECLARE @create_table_stmt NVARCHAR(max);


   SET @data_table_name = 'loading_' + CAST(@client_id AS VARCHAR);
   
   SET @create_table_stmt = 'CREATE TABLE dbo.' + @data_table_name + ' (' + 
	'[loading_id] [int] IDENTITY(1,1) NOT NULL,'+
	'[load_date] [datetime] NOT NULL,'+
	'[qr_id] [int] NULL,'+
	'[load_amount] [decimal](18, 2) NOT NULL,'+
	'[device_id] [int] NULL,'+
	'[load_by] [int] NULL,'+
	'[remit_id] [int] NULL,'+
	'[prev_qr_id] [int] NULL,'+
	'[loading_charge] [decimal](8, 2) NULL,'+
	'[loading_branch_id] [int] NULL,'+
	'[is_top_up] [char](1) NULL,'+
	'[ref_no] [nvarchar](30) NULL,'+
	'[consumer_id] [int] NULL)'
	  
     IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'U' AND name = @data_table_name)
     EXEC (@create_table_stmt);
END;
--[dbo].[create_loading_tbl] @client_id=2
