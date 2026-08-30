namespace Backend_Api.Services
{
    public class SqlValidator
    {
        public bool IsSafeSelect(string sql)
        {
            if (string.IsNullOrWhiteSpace(sql))
            {
                return false;
            }

            sql = sql.Trim();

            // Query must start with SELECT
            if (!sql.StartsWith(
                "SELECT",
                StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            // Block dangerous SQL commands
            string[] blockedKeywords =
            {
                "INSERT",
                "UPDATE",
                "DELETE",
                "DROP",
                "ALTER",
                "TRUNCATE",
                "CREATE",
                "REPLACE",
                "GRANT",
                "REVOKE"
            };

            foreach (var keyword in blockedKeywords)
            {
                if (sql.Contains(
                    keyword,
                    StringComparison.OrdinalIgnoreCase))
                {
                    return false;
                }
            }

            return true;
        }
    }
}
