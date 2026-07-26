import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './PatientRegistration.css';

// Usage: <PatientRegistration apiUrl="https://localhost:7146/api/PatinetRegistration" />
const emptyForm = {
  patientName: '',
  Dob: '',
  age: '',
  gender: '',
  fatherName: '',
  address: '',
  phoneNo: '',
  disease: '',
  enquiry: '',
  surgeonName: '',
};

export default function PatientRegistration({ apiUrl }) {
  // ---- Registration form state ----
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ---- Followup lookup state ----
  const [lookupPhone, setLookupPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData(emptyForm);
    setSaveMessage('');
  };

  const handleSave = async () => {
    
    if (!formData.patientName || !formData.phoneNo) {
      setSaveSuccess(false);
      setSaveMessage('Please fill in at least patient name and phone number.');
      return;
    }

    setSaving(true);
    setSaveMessage('');
    try {
        
      const response = await fetch(`${apiUrl}/Insert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      // adjust these keys to match your backend's actual response casing
      if (result.success === 1 || result.Success === 1) {
        setSaveSuccess(true);
        setSaveMessage(result.message || result.Message || 'Patient registered successfully.');
        setShowSuccessModal(true);
        setFormData(emptyForm);
      } else {
        setSaveSuccess(false);
        setSaveMessage(result.message || result.Message || 'Could not register patient.');
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error(err);
      setSaveSuccess(false);
      setSaveMessage('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

const handleLookup = async () => {
    if (!lookupPhone) return;
    setSearching(true);
    setLookupError('');
    try {
      const response = await fetch(`${apiUrl}/Followup?phoneNo=${encodeURIComponent(lookupPhone)}`);
      if (response.status === 404) {
        setLookupError('No patient found with this phone number.');
        return;
      }
      if (!response.ok) throw new Error('Lookup failed');
      const data = await response.json();

      // bind the found record directly into the registration form fields below
      setFormData({
        patientName: data.patientName || data.PatientName || '',
        dob: (data.Dob || data.Dob || '').slice(0, 10),
        age: data.age || data.Age || '',
        gender: data.gender || data.Gender || 'Male',
        fatherName: data.fatherName || data.FatherName || '',
        address: data.address || data.Address || '',
        phoneNo: data.phoneNo || data.PhoneNo || '',
        disease: data.disease || data.Disease || '',
        enquiry: data.enquiry || data.Enquiry || '',
        surgeonName: data.surgeonName || data.SurgeonName || '',
      });
    } catch (err) {
      console.error(err);
      setLookupError('Something went wrong while searching.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="stack">
      {/* ---- Top: followup lookup ---- */}
      <div className="panel form-panel">
        <h3>Find existing patient</h3>
        <p className="panel-subtext">Look up a patient by phone number for a followup visit</p>

        <div className="lookup-row">
          <input
            value={lookupPhone}
            onChange={(e) => setLookupPhone(e.target.value)}
            placeholder="Enter phone number"
          />
          <button className="btn-primary" onClick={handleLookup} disabled={searching}>
            <Search size={16} /> {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        

        {lookupResult && (
          <div className="lookup-result">
            <div className="lookup-row-item">
              <span className="muted">Patient ID</span>
              <span>{lookupResult.patientID || lookupResult.PatientID}</span>
            </div>
            <div className="lookup-row-item">
              <span className="muted">Name</span>
              <span>{lookupResult.patientName || lookupResult.PatientName}</span>
            </div>
            <div className="lookup-row-item">
              <span className="muted">Phone number</span>
              <span>{lookupResult.phoneNo || lookupResult.PhoneNo}</span>
            </div>
            <div className="lookup-row-item">
              <span className="muted">Date of birth</span>
              <span>{(lookupResult.Dob || lookupResult.Dob || '').slice(0, 10)}</span>
            </div>
            <div className="lookup-row-item">
              <span className="muted">Gender</span>
              <span>{lookupResult.gender || lookupResult.Gender}</span>
            </div>
          </div>
        )}
      </div>

      {/* ---- Bottom: registration form ---- */}
      <div className="panel form-panel form-panel-wide">
        <h3>Patient registration</h3>
        <p className="panel-subtext">Enter patient details and save</p>

        {saveMessage && (
          <p className={saveSuccess ? 'form-message form-message-success' : 'form-message form-message-error'}>
            {saveMessage}
          </p>
        )}

        <div className="form-grid form-grid-3col">
          <div className="form-field">
            <label>Patient name</label>
            <input name="patientName" value={formData.patientName} onChange={handleChange} placeholder="Enter patient name" />
          </div>
          <div className="form-field">
            <label>Date of birth</label>
            <input type="date" name="Dob" value={formData.Dob} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Enter age" />
          </div>

          <div className="form-field">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-field">
            <label>Father name</label>
            <input name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Enter father's name" />
          </div>
          <div className="form-field">
            <label>Phone number</label>
            <input name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="Enter phone number" />
          </div>

          <div className="form-field">
            <label>Disease</label>
            <input name="disease" value={formData.disease} onChange={handleChange} placeholder="Enter disease/condition" />
          </div>
          <div className="form-field">
            <label>Enquiry</label>
            <input name="enquiry" value={formData.enquiry} onChange={handleChange} placeholder="Enter enquiry source/notes" />
          </div>
          <div className="form-field">
            <label>Surgeon name</label>
            <input name="surgeonName" value={formData.surgeonName} onChange={handleChange} placeholder="Enter surgeon name" />
          </div>

          <div className="form-field form-field-full">
            <label>Address</label>
            <textarea rows={3} name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save patient'}
          </button>
          <button className="btn-secondary" onClick={handleClear} disabled={saving}>
            Clear
          </button>
        </div>
      </div>
    </div>

    //new code added 
  );

  // new code addeed
  
}
