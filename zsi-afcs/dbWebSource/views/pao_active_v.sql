

CREATE VIEW [dbo].[pao_active_v]
AS
SELECT client_id, id AS user_id, emp_hash_key AS hash_key, last_name, first_name, emp_lfm_name AS full_name, img_filename, middle_name, name_suffix, is_active
FROM     zsi_hcm.dbo.employees_v
WHERE  (position_id = 4) AND (is_active = 'Y')

