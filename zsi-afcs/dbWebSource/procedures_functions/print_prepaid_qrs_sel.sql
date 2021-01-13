CREATE PROCEDURE [dbo].[print_prepaid_qrs_sel] 
(
	@user_id INT
)
as
begin
select TOP 100 hash_key, hash_key2 FROM dbo.generated_qrs where is_taken='Y' and is_active='Y' and consumer_id is null
end