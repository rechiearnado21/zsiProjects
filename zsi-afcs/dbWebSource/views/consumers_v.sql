


CREATE view [dbo].[consumers_v] as
SELECT c.consumer_id, c.hash_key, c.first_name, c.middle_name, c.last_name, c.name_suffix, c.gender, c.address, c.city_id, c.state_id, c.country_id, c.email, c.password, c.image_filename, c.is_active, c.activation_code, c.birthdate, c.mobile_no, 
                  c.landline_no, c.tin, CONCAT(c.address, ' ', p.place_name)  AS place_name, c.qr_id, c.transfer_type_id, c.bank_id, c.transfer_no, c.created_by, c.created_date, c.updated_by, 
                  c.updated_date
FROM  dbo.consumers AS c LEFT OUTER JOIN
                  dbo.places_v AS p ON c.city_id = p.city_id

