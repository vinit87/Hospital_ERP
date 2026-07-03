using Microsoft.AspNetCore.Mvc;
using Backend_Api.Model;
using System.Data;
using MySql.Data.MySqlClient;

namespace Backend_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLogin loginData)
        {
            // Step 1: Basic validation
            //if (string.IsNullOrEmpty(loginData.Email) || string.IsNullOrEmpty(loginData.Password))
            //{
            //    return BadRequest("Email and Password are required.");
            //}

            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = "SELECT COUNT(*) FROM UsersLogin WHERE Email = @Email AND Password = @Password";

                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Email", loginData.Email);
                        command.Parameters.AddWithValue("@Password", loginData.Password);

                        int count = Convert.ToInt32(command.ExecuteScalar());

                        if (count > 0)
                        {
                            return Ok("Welcome! Login successful.");
                        }
                        else
                        {
                            return Unauthorized("Invalid email or password.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Server error: " + ex.Message);
            }
        }

    }
}


    
 