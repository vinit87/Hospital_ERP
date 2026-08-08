using Microsoft.AspNetCore.Mvc;
using Backend_Api.Model;
using System.Data;
using MySql.Data.MySqlClient;

namespace Backend_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly string _connectionString;

        public DashboardController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet("summary")]
        public IActionResult GetDashboardSummary()
        {
            Dashboard dashboard = new Dashboard();

            using (MySqlConnection connection = new MySqlConnection(_connectionString))
            {
                using (MySqlCommand command = new MySqlCommand("sp_DashboardSummary", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    connection.Open();

                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            dashboard.TotalPatients = reader.GetInt32("total_patients");
                            dashboard.CancerCases = reader.GetInt32("cancer_cases");
                            dashboard.RegistrationsToday = reader.GetInt32("registrations_today");
                            dashboard.DoctorRecords = reader.GetInt32("doctor_records");
                        }
                    }
                }
            }

            return Ok(dashboard);
        }
    }
}