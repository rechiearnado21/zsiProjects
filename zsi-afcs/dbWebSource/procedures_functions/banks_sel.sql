create procedure dbo.banks_sel (
  @is_active char(1) = ''
 ,@user_id int = null
)
as
begin
  set nocount on
  declare @stmt  nvarchar(max)=''
  set @stmt = 'select * from dbo.banks where 1=1 '
  if isnull(@is_active,'') <> ''
     set @stmt = @stmt + ' AND is_active = ''' + @is_active + ''''

  EXEC(@stmt);
end