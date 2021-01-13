
create function dbo.getColumnName(
    @criteria_column_id int
)
returns nvarchar(100)
as
begin
   declare @retval nvarchar(100)
   select @retval = column_name from dbo.criteria_columns where criteria_id=@criteria_column_id
   return @retval;
end