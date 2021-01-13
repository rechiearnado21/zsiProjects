CREATE PROCEDURE [dbo].[create_vehicle_trips_tbl] 
   @client_id int
AS
BEGIN  
   SET NOCOUNT ON;

   DECLARE @data_table_name VARCHAR(100);
   DECLARE @create_table_stmt NVARCHAR(max);


   SET @data_table_name = 'vehicle_trips_' + CAST(@client_id AS VARCHAR);
   
   SET @create_table_stmt = 'CREATE TABLE dbo.' + @data_table_name + ' ('
                     + ' trip_id int IDENTITY(1,1) NOT NULL, '
					 + ' trip_no INT NULL, '
                     + ' vehicle_id int, '
                     + ' driver_id int, '
                     + ' pao_id int NULL, '
					 + ' route_id int NULL, '
					 + ' route_no int NULL, '
                     + ' start_date DATE NULL, '
                     + ' end_date DATE NULL, '
					 + ' start_odo int NULL, '
                     + ' end_odo int NULL, '
					 + ' start_by int NULL, '
                     + ' end_by int NULL, '
					 + ' no_kms int NULL, '
                     + ' total_collection_amount decimal(18,2) NULL, '
					 + ' is_open char(1) NULL,'
					 + ' trip_hash_key nvarchar(100) NULL,'
                     + ' CONSTRAINT pk_' + @data_table_name + ' PRIMARY KEY CLUSTERED (trip_id ASC )'
                     + ' WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY] ) ON [PRIMARY]';
				  
     IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'U' AND name = @data_table_name)
     EXEC (@create_table_stmt);
END;

--[dbo].[create_vehicle_trips] @client_id=2

