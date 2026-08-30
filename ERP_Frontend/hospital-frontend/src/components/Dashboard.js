// import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import MasterTable from './Master/MasterA';
import PatientRegistration from './patient/PatientRegistration';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Database, ClipboardList, Users, LogOut,
  Search, Plus, Pencil, Trash2, Menu, Stethoscope,
} from 'lucide-react';
import './Dashboard.css';

import AIChatbot from "../components/AIChatbot/AIChatbot";

// ---- Dummy data — replace with your API calls ----
// const dummyStats = [
//   { label: 'Total patients', value: '1,284'},
//   { label: 'Doctor records', value: '48'},
//   { label: 'Cancer Cases', value: '26' },
//   { label: 'Registrations today', value: '9'},
// ];


const masterA = [
  { id: 1, name: 'General Ward', code: 'GW-01', status: 'Active' },
  { id: 2, name: 'ICU', code: 'IC-02', status: 'Active' },
  { id: 3, name: 'Radiology', code: 'RD-03', status: 'Inactive' },
];

// const masterB = [
//   { id: 1, name: 'Dr. Mehta', code: 'DOC-01', status: 'Active' },
//   { id: 2, name: 'Dr. Kapoor', code: 'DOC-02', status: 'Active' },
// ];

// const recentPatients = [
//   { id: 101, name: 'Ravi Sharma', age: 34, gender: 'Male', phone: '98xxxxxx21', date: '18 Jul 2026' },
//   { id: 102, name: 'Anjali Verma', age: 27, gender: 'Female', phone: '99xxxxxx45', date: '18 Jul 2026' },
//   { id: 103, name: 'Suresh Yadav', age: 51, gender: 'Male', phone: '97xxxxxx10', date: '17 Jul 2026' },
// ];

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'masterA', label: 'Master A', icon: Database },
  // { key: 'masterB', label: 'Master B', icon: Database },
  { key: 'registration', label: 'Patient registration', icon: ClipboardList },
];

function StatCard({ label, value, delta }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <p className="stat-delta">{delta}</p>
    </div>
  );
}



export default function Dashboard() {
    const navigate = useNavigate();                          
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // add this
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Recent registrations — real data from API
const [recentPatients, setRecentPatients] = useState([]);
const [loading, setLoading] = useState(false);

const [stats, setStats] = useState({
  totalPatients: 0,
  cancerCases: 0,
  registrationsToday: 0,
  doctorRecords: 0,
});
const [statsLoading, setStatsLoading] = useState(true);

useEffect(() => {
  fetch('https://localhost:7146/api/Dashboard/summary')
    .then((res) => res.json())
    .then((data) => {
      setStats({
        totalPatients: data.totalPatients,
        cancerCases: data.cancerCases,
        registrationsToday: data.registrationsToday,
        doctorRecords: data.doctorRecords,
      });
    })
    .catch((err) => console.error('Error fetching dashboard summary:', err))
    .finally(() => setStatsLoading(false));
}, []);

useEffect(() => {
  fetch('https://localhost:7146/api/PatinetRegistration/GetAll')
    .then((res) => res.json())
    .then((data) => {
      const list = Array.isArray(data) ? data : (data.items ?? []);
      setRecentPatients(list);
    })
    .catch((err) => console.error('Error fetching patients:', err))
    .finally(() => setLoading(false));
}, []);

  const pageTitle =
    active === 'masterA' ? 'Master A' :
    // active === 'masterB' ? 'Master B' :
    active === 'registration' ? 'Patient registration' : 'Dashboard';

  return (
    <>   
    <div className="erp-container">
      <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <div className="sidebar-header">
          <Stethoscope size={22} className="brand-icon" />
          {sidebarOpen && <span className="brand-text">Clinic ERP</span>}
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        {/* <div className="sidebar-footer">
          <button className="nav-item logout-btn">
            <LogOut size={18} />
            {sidebarOpen && <span>Log out</span>}
          </button>
        </div> */}
        <div className="sidebar-footer">
  <button className="nav-item logout-btn" onClick={() => setShowLogoutConfirm(true)}>
    <LogOut size={18} />
    {sidebarOpen && <span>Log out</span>}
  </button>
</div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </button>
            <h1>{pageTitle}</h1>
          </div>
          <div className="topbar-right">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input placeholder="Search..." />
            </div>
            <div className="avatar">U</div>
          </div>
        </header>

        <main className="page-content">
          {active === 'dashboard' && (
            <div className="stack">
            <div className="stats-grid">
  <StatCard label="Total patients" value={statsLoading ? '...' : stats.totalPatients} />
  <StatCard label="Doctor records" value={statsLoading ? '...' : stats.doctorRecords} />
  <StatCard label="Cancer Cases" value={statsLoading ? '...' : stats.cancerCases} />
  <StatCard label="Registrations today" value={statsLoading ? '...' : stats.registrationsToday} />
</div>
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title-with-icon">
                    <Users size={16} />
                    <h3>Recent registrations</h3>
                  </div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Phone</th>
                        <th>Disease</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPatients.map((p) => (
                        <tr key={p.id}>
                          <td>{p.patientName}</td>
                          <td className="muted">{p.age}</td>
                          <td className="muted">{p.gender}</td>
                          <td className="muted">{p.phoneNo}</td>
                          <td className="muted">{p.disease}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {active === 'masterA' && <MasterTable title="Doctor Master" apiUrl="https://localhost:7146/api/Doctor" />}
          {/* {active === 'masterB' && <MasterTable title="Master B" apiUrl="https://localhost:7146/api/Doctor"  />} */}
          {active === 'registration' && <PatientRegistration apiUrl="https://localhost:7146/api/PatinetRegistration" />}
        </main>
      
      </div>
    

      </div>
     {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                No
              </button>
              <button
                className="btn-danger"
                onClick={() => navigate('/')}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      <AIChatbot />
      </>   
  );
}
