CREATE VIEW dbo.consumer_loading_13_v AS 
                                  SELECT loading_id, load_date,load_amount, load_by, ref_no, 
								  iif(is_top_up='Y','Share-a-load','PREPAID LOAD') store_code  
                                  FROM dbo.loading WHERE qr_id=509UNION SELECT loading_id, load_date,(load_amount * -1) load_amount, load_by, ref_no, 
								  'Share-a-load' store_code
								  FROM dbo.loading WHERE load_by=13