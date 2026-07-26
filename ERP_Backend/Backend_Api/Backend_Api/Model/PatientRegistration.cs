namespace Backend_Api.Model
{
    public class PatientRegistration
    {
        public string PatientName { get; set; }
        public int Age { get; set; }
        public DateTime Dob { get; set; }
        public string Gender { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string PhoneNo { get; set; }
        public string Disease { get; set; }
        public string Enquiry { get; set; }
        public string SurgeonName { get; set; }
    }

    public class PatientFollowupRequest
    {
        public string MobileNumber { get; set; }
    }
}
