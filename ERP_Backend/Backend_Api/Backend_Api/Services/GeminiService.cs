
using System.Text;
using System.Text.Json;

namespace Backend_Api.Services
{
    public class GeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public GeminiService(
            HttpClient httpClient,
            IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        // =====================================================
        // NORMAL GEMINI CHAT
        // =====================================================
        public async Task<string> AskGemini(string prompt)
        {
            var apiKey = _configuration["Gemini:ApiKey"];

            var model = "gemini-3.6-flash";

            var url =
                $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new
                            {
                                text = prompt
                            }
                        }
                    }
                }
            };

            var json = JsonSerializer.Serialize(requestBody);

            var content = new StringContent(
                json,
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(url, content);

            var responseBody =
                await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception(
                    $"Gemini API Error: {responseBody}"
                );
            }

            using var document =
                JsonDocument.Parse(responseBody);

            var answer =
                document.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

            return answer ?? "";
        }


        // =====================================================
        // CLINICAL AI : QUESTION → SQL
        // =====================================================
        public async Task<string> GenerateSql(string userQuestion)
        {
            var prompt = $@"
You are an expert MySQL SQL query generator.

You are working for a Clinical Hospital Management System.

Convert the user's natural language question into a valid MySQL query.

DATABASE:

Table Name: registration

Columns:

id              INT
patient_name    VARCHAR(100)
age             INT
dob             DATE
gender          VARCHAR(10)
father_name     VARCHAR(100)
address         VARCHAR(255)
phone_no        VARCHAR(15)
disease         VARCHAR(100)
enquiry         VARCHAR(100)
surgeon_name    VARCHAR(100)

STRICT RULES:

1. Generate ONLY SELECT queries.
2. Never generate INSERT.
3. Never generate UPDATE.
4. Never generate DELETE.
5. Never generate DROP.
6. Never generate ALTER.
7. Never generate TRUNCATE.
8. Use ONLY the registration table.
9. Use ONLY the columns listed above.
10. Database is MySQL.
11. Return ONLY SQL.
12. Do not use markdown.
13. Do not explain anything.
14. If the question cannot be answered from this schema, return exactly:
INVALID_QUERY

USER QUESTION:

{userQuestion}
";

            var sql = await AskGemini(prompt);

            return CleanSql(sql);
        }


        public async Task<string> GenerateFinalAnswer(
    string userQuestion,
    string queryResult)
        {
            var prompt = $@"
You are an AI assistant for a Clinical Hospital Management System.

The user asked:

{userQuestion}

The database query result is:

{queryResult}

Your task is to answer the user's question using ONLY the database result provided above.

RULES:

1. Do not invent any information.
2. Do not provide SQL.
3. Do not mention the database.
4. Do not mention Gemini.
5. Give a clear and concise answer.
6. If the result contains a count, clearly mention the count.
7. If the result contains patient records, summarize them clearly.
8. If there is no data, clearly say that no matching records were found.

Return only the final answer.
";

            return await AskGemini(prompt);
        }

        // =====================================================
        // REMOVE ```sql CODE BLOCK IF GEMINI RETURNS IT
        // =====================================================
        private string CleanSql(string sql)
        {
            sql = sql.Trim();

            if (sql.StartsWith("```sql"))
            {
                sql = sql.Replace("```sql", "");
            }

            if (sql.StartsWith("```"))
            {
                sql = sql.Replace("```", "");
            }

            if (sql.EndsWith("```"))
            {
                sql = sql.Substring(0, sql.Length - 3);
            }

            return sql.Trim();
        }
    }
}