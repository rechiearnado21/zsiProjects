
CREATE VIEW [dbo].[places_v]
AS
SELECT CONCAT(city_name,' ',replace(city_code,' ',''),', ',state_name, ', ', country_name) place_name, city_id
FROM     dbo.cities INNER JOIN
                  dbo.states ON dbo.cities.state_id = dbo.states.state_id INNER JOIN
                  dbo.countries ON dbo.states.country_id = dbo.countries.country_id
