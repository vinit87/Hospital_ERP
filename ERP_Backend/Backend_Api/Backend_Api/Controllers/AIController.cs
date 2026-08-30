using Backend_Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly GeminiService _geminiService;
        private readonly DatabaseService _databaseService;
        private readonly SqlValidator _sqlValidator;

        public AIController(
            GeminiService geminiService,
            DatabaseService databaseService,
            SqlValidator sqlValidator)
        {
            _geminiService = geminiService;
            _databaseService = databaseService;
            _sqlValidator = sqlValidator;
        }

        // =====================================================
        // NORMAL GEMINI CHAT
        // =====================================================
        [HttpPost("chat")]
        public async Task<IActionResult> Chat(
            [FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("Message is required.");
            }

            var answer =
                await _geminiService.AskGemini(request.Message);

            return Ok(new
            {
                answer
            });
        }


        // =====================================================
        // GENERATE SQL ONLY
        // =====================================================
        [HttpPost("generate-sql")]
        public async Task<IActionResult> GenerateSql(
            [FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("Message is required.");
            }

            var sql =
                await _geminiService.GenerateSql(request.Message);

            return Ok(new
            {
                sql = sql
            });
        }


        // =====================================================
        // AI → SQL → VALIDATE → MYSQL
        // =====================================================
        [HttpPost("query")]
        public async Task<IActionResult> Query(
    [FromBody] ChatRequest request)
        {
            // 1. Validate user message
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("Message is required.");
            }

            // 2. Generate SQL
            var sql =
                await _geminiService.GenerateSql(request.Message);

            // 3. Check invalid query
            if (sql.Equals(
                "INVALID_QUERY",
                StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(
                    "This question cannot be answered using the available clinical data."
                );
            }

            // 4. Validate SQL
            if (!_sqlValidator.IsSafeSelect(sql))
            {
                return BadRequest(
                    "Generated SQL query is not allowed."
                );
            }

            // 5. Execute SQL
            var data =
                await _databaseService.ExecuteSelect(sql);

            // 6. Convert database result to JSON
            var queryResult =
                System.Text.Json.JsonSerializer.Serialize(data);

            // 7. Ask Gemini to create human-readable answer
            var finalAnswer =
                await _geminiService.GenerateFinalAnswer(
                    request.Message,
                    queryResult
                );

            // 8. Return final response
            return Ok(new
            {
                answer = finalAnswer
            });
        }
    }


    // =========================================================
    // REQUEST MODEL
    // =========================================================
    public class ChatRequest
    {
        public string Message { get; set; } = "";
    }
}