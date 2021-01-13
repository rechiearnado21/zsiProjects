CREATE VIEW dbo.load_merchants_v
AS
SELECT client_id, hash_key, client_code, client_name, client_phone_no, client_mobile_no, client_email_add, billing_address, country_id, state_id, city_id, registration_date, account_exec_id, billing_class_id, bank_acct_no, bank_id, is_tax_exempt, 
                  client_tin, payment_mode_id, balance_amount, main_id, is_active, is_zfare, is_zload, created_by, created_date, updated_by, updated_date
FROM     zsi_crm.dbo.clients
WHERE  (is_zload = 'Y') AND (is_active = 'Y')
