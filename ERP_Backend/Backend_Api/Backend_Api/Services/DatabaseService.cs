
using MySql.Data.MySqlClient;

namespace Backend_Api.Services
{
    public class DatabaseService
    {
        private readonly IConfiguration _configuration;

        public DatabaseService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<Dictionary<string, object>>> ExecuteSelect(
            string sql)
        {
            var connectionString =
                _configuration.GetConnectionString("DefaultConnection");

            var result = new List<Dictionary<string, object>>();

            using var connection =
                new MySqlConnection(connectionString);

            await connection.OpenAsync();

            using var command =
                new MySqlCommand(sql, connection);

            using var reader =
                await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var row = new Dictionary<string, object>();

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    row[reader.GetName(i)] =
                        reader.IsDBNull(i)
                            ? null!
                            : reader.GetValue(i);
                }

                result.Add(row);
            }

            return result;
        }
    }
}
