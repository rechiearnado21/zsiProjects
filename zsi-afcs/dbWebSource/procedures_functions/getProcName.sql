CREATE FUNCTION [dbo].[getProcName] ( 
  @s nvarchar(50)
)
returns varchar(100)
as
begin
  declare @pn varchar(100)
  select @pn=sqlcmd_text  from dbo.sql_commands where sqlcmd_code = @s;
  return @pn;
end