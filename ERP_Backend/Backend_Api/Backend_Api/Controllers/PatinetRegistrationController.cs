using Microsoft.AspNetCore.Mvc;
using Backend_Api.Model;
using System.Data;
using MySql.Data.MySqlClient;


namespace Backend_Api.Controllers
{
   

    [ApiController]
    [Route("api/[controller]")]
    public class PatinetRegistrationController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public PatinetRegistrationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // ========================
        // POST: api/Patient/Insert
        // ========================
        [HttpPost("Insert")]
        public IActionResult Insert([FromBody] PatientRegistration request)
        {
            using var connection = new MySqlConnection(
                _configuration.GetConnectionString("DefaultConnection"));
            connection.Open();

            using var cmd = new MySqlCommand("sp_PatientRegistration", connection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("p_Mode", "INSERT");
            cmd.Parameters.AddWithValue("p_PatientName", request.PatientName);
            cmd.Parameters.AddWithValue("p_Age", request.Age);
            cmd.Parameters.AddWithValue("p_Dob", request.Dob);
            cmd.Parameters.AddWithValue("p_Gender", request.Gender);
            cmd.Parameters.AddWithValue("p_FatherName", request.FatherName);
            cmd.Parameters.AddWithValue("p_Address", request.Address);
            cmd.Parameters.AddWithValue("p_PhoneNo", request.PhoneNo);
            cmd.Parameters.AddWithValue("p_Disease", request.Disease);
            cmd.Parameters.AddWithValue("p_Enquiry", request.Enquiry);
            cmd.Parameters.AddWithValue("p_SurgeonName", request.SurgeonName);

            using var reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                return Ok(new
                {
                    Success = Convert.ToInt32(reader["Success"]),
                    Message = reader["Message"].ToString(),
                    PatientID = reader["PatientID"] == DBNull.Value
                                ? null
                                : (int?)Convert.ToInt32(reader["PatientID"])
                });
            }

            return BadRequest(new { Success = 0, Message = "Something went wrong." });
        }

        // ========================
        // GET: api/PatinetRegistration/Followup?phoneNo=9999988888
        // ========================
        [HttpGet("Followup")]
        public IActionResult Followup([FromQuery] string phoneNo)
        {
            using var connection = new MySqlConnection(
                _configuration.GetConnectionString("DefaultConnection"));
            connection.Open();

            using var cmd = new MySqlCommand("sp_PatientRegistration", connection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("p_Mode", "FOLLOWUP");
            cmd.Parameters.AddWithValue("p_PatientName", DBNull.Value);
            cmd.Parameters.AddWithValue("p_Age", DBNull.Value);
            cmd.Parameters.AddWithValue("p_Dob", DBNull.Value);
            cmd.Parameters.AddWithValue("p_Gender", DBNull.Value);
            cmd.Parameters.AddWithValue("p_FatherName", DBNull.Value);
            cmd.Parameters.AddWithValue("p_Address", DBNull.Value);
            cmd.Parameters.AddWithValue("p_PhoneNo", phoneNo);
            cmd.Parameters.AddWithValue("p_Disease", DBNull.Value);
            cmd.Parameters.AddWithValue("p_Enquiry", DBNull.Value);
            cmd.Parameters.AddWithValue("p_SurgeonName", DBNull.Value);

            using var reader = cmd.ExecuteReader();

            if (!reader.HasRows)
            {
                return NotFound(new
                {
                    Success = 0,
                    Message = "No patient found with this phone number."
                });
            }

            if (reader.Read())
            {
                return Ok(new
                {
                    PatientID = Convert.ToInt32(reader["id"]),
                    PatientName = reader["patient_name"].ToString(),
                    Age = Convert.ToInt32(reader["age"]),
                    Dob = reader["dob"].ToString(),
                    Gender = reader["gender"].ToString(),
                    FatherName = reader["father_name"].ToString(),
                    Address = reader["address"].ToString(),
                    PhoneNo = reader["phone_no"].ToString(),
                    Disease = reader["disease"].ToString(),
                    Enquiry = reader["enquiry"].ToString(),
                    SurgeonName = reader["surgeon_name"].ToString()
                });
            }

            return BadRequest(new { Success = 0, Message = "Something went wrong." });
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var patients = new List<PatientRegistration>();

            
           using var connection = new MySqlConnection(
                _configuration.GetConnectionString("DefaultConnection"));

            connection.Open();

            using var cmd = new MySqlCommand("sp_PatientRegistration", connection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("p_Mode", "GETALL");

            
            cmd.Parameters.AddWithValue("p_PatientName", DBNull.Value);
            cmd.Parameters.AddWithValue("p_Age", DBNull.Value);
            cmd.Parameters.AddWithValue("p_Dob", DBNull.Value);
            cmd.Parameters.AddWithValue("p_Gender", DBNull.Value);
            cmd.Parameters.AddWithValue("p_FatherName", DBNull.Value);
            cmd.Parameters.AddWithValue("p_Address", DBNull.Value);
            cmd.Parameters.AddWithValue("p_PhoneNo", DBNull.Value);
            cmd.Parameters.AddWithValue("p_Disease", DBNull.Value);
            cmd.Parameters.AddWithValue("p_Enquiry", DBNull.Value);
            cmd.Parameters.AddWithValue("p_SurgeonName", DBNull.Value);

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                patients.Add(new PatientRegistration
                {

                    PatientName = reader["patient_name"].ToString(),
                    Age = Convert.ToInt32(reader["age"]),
                    Dob = Convert.ToDateTime(reader["dob"]),
                    Gender = reader["gender"].ToString(),
                    FatherName = reader["father_name"].ToString(),
                    Address = reader["address"].ToString(),
                    PhoneNo = reader["phone_no"].ToString(),
                    Disease = reader["disease"].ToString(),
                    Enquiry = reader["enquiry"].ToString(),
                    SurgeonName = reader["surgeon_name"].ToString()
                });
            }

            return Ok(patients);
        }

    }
}
