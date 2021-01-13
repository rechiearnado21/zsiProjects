
CREATE PROCEDURE [dbo].[create_vehicle_pms_tbl] 
   @client_id int
AS
BEGIN  
   SET NOCOUNT ON;

   DECLARE @data_table_name VARCHAR(100);
   DECLARE @create_table_stmt NVARCHAR(max);


   SET @data_table_name = 'vehicle_pms_' + CAST(@client_id AS VARCHAR(20));
   
    SET @create_table_stmt = 'CREATE TABLE dbo.' + @data_table_name + ' (' +
	'[pms_id] [int] IDENTITY(1,1) NOT NULL,'+
	'[pms_date] [date] NULL,'+
	'[pms_type_id] [int] NULL,'+
	'[vehicle_id] [int] NULL,'+
	'[odo_reading] [int] NULL,'+
	'[pm_amount] [decimal](10, 2) NULL,'+
	'[pm_location] [nvarchar](50) NULL,'+
	'[service_amount] [decimal](10, 2) NULL,'+
	'[comment] [nvarchar](max) NULL,'+
	'[status_id] [int] NULL,'+
	'[created_by] [int] NULL,'+
	'[created_date] [datetime] NULL,'+
	'[updated_by] [int] NULL,'+
	'[updated_date] [datetime] NULL,'+
	'[is_posted] [char](1) NULL,'+
 'CONSTRAINT [PK_' + @data_table_name + '] PRIMARY KEY CLUSTERED 
(
	[pms_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]'
				  
     IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'U' AND name = @data_table_name)
     EXEC (@create_table_stmt);
END;



--[dbo].[create_vehicle_pms_tbl] @client_id=1

