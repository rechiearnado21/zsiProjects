


CREATE VIEW [dbo].[drivers_active_v]
AS
SELECT client_id, id AS user_id, emp_hash_key AS hash_key, last_name, first_name, emp_lfm_name AS full_name, img_filename, is_active, driver_academy_no, driver_license_no, driver_licence_img_filename, 
                  driver_license_exp_date
FROM     zsi_hcm.dbo.employees_v
WHERE  (position_id = 3) AND (is_active = 'Y')

