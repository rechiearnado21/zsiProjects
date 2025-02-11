﻿namespace createCodeBackup
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;

    public class dcTable
    {


        public List<fileModel> getList()
        {
            try
            {
                SqlConnection conn = new SqlConnection(settings.dbConnectionString);

                SqlCommand command = new SqlCommand("SELECT TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_TYPE='BASE TABLE'", conn);
                conn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                List<fileModel> _list = new List<fileModel>();
                while (reader.Read())
                {
                    _list.Add(new fileModel { fileName = reader["TABLE_NAME"].ToString(), content = createCode(reader["TABLE_NAME"].ToString()) });

                }
                reader.Close();
                conn.Close();
                return _list;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        public string createCode(string TableName)
        {
            try
            {
                string result = "CREATE TABLE " + TableName + "(" ;
                SqlConnection conn = new SqlConnection(settings.dbConnectionString);

                SqlCommand command = new SqlCommand("sp_columns", conn);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(new SqlParameter("@table_name", TableName));
                conn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                string comma = "";
                while (reader.Read())
                {
                    string type = reader["TYPE_NAME"].ToString();
                    int size = Convert.ToInt32(reader["LENGTH"]);
                    int nullable = Convert.ToInt32(reader["NULLABLE"]);
                    result += "\r\n" + comma + reader["COLUMN_NAME"].ToString() + "\t" + (type.Contains("identity") ? type.ToUpper() + "(1,1)" :  (type =="int" || type.Contains("date") ? type.ToUpper() : type.ToUpper() + "(" + size + ")"  )  ) + "\t" + (nullable==0 ? "NOT NULL" :"NULL") ;
                    comma = ",";
                }
                reader.Close();
                conn.Close();
                return result + ")";
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


    }

}

