import React, { useState } from 'react';
import MasterTable from './Master/MasterA';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Database, ClipboardList, Users, LogOut,
  Search, Plus, Pencil, Trash2, Menu, Stethoscope,
} from 'lucide-react';
import './Dashboard.css';

// ---- Dummy data — replace with your API calls ----
const dummyStats = [
  { label: 'Total patients', value: '1,284', delta: '+12 this week' },
  { label: 'Master A records', value: '48', delta: '+3 this week' },
  { label: 'Master B records', value: '26', delta: '+1 this week' },
  { label: 'Registrations today', value: '9', delta: 'Live' },
];

const masterA = [
  { id: 1, name: 'General Ward', code: 'GW-01', status: 'Active' },
  { id: 2, name: 'ICU', code: 'IC-02', status: 'Active' },
  { id: 3, name: 'Radiology', code: 'RD-03', status: 'Inactive' },
];

const masterB = [
  { id: 1, name: 'Dr. Mehta', code: 'DOC-01', status: 'Active' },
  { id: 2, name: 'Dr. Kapoor', code: 'DOC-02', status: 'Active' },
];

const recentPatients = [
  { id: 101, name: 'Ravi Sharma', age: 34, gender: 'Male', phone: '98xxxxxx21', date: '18 Jul 2026' },
  { id: 102, name: 'Anjali Verma', age: 27, gender: 'Female', phone: '99xxxxxx45', date: '18 Jul 2026' },
  { id: 103, name: 'Suresh Yadav', age: 51, gender: 'Male', phone: '97xxxxxx10', date: '17 Jul 2026' },
];

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'masterA', label: 'Master A', icon: Database },
  { key: 'masterB', label: 'Master B', icon: Database },
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

// function MasterTable({ title, rows }) {
//   return (
//     <div className="panel">
//       <div className="panel-header">
//         <div>
//           <h3>{title}</h3>
//           <p className="panel-subtext">Manage records used across the system</p>
//         </div>
//         <button className="btn-primary">
//           <Plus size={16} /> Add new
//         </button>
//       </div>
//       <div className="table-wrap">
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Code</th>
//               <th>Status</th>
//               <th className="text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row) => (
//               <tr key={row.id}>
//                 <td>{row.name}</td>
//                 <td className="muted">{row.code}</td>
//                 <td>
//                   <span className={`badge ${row.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
//                     {row.status}
//                   </span>
//                 </td>
//                 <td>
//                   <div className="row-actions">
//                     <button className="icon-btn"><Pencil size={16} /></button>
//                     <button className="icon-btn icon-btn-danger"><Trash2 size={16} /></button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

function RegistrationForm() {
  return (
    <div className="panel form-panel">
      <h3>Patient registration</h3>
      <p className="panel-subtext">Enter patient details and save</p>
      <div className="form-grid">
        <div className="form-field">
          <label>Full name</label>
          <input placeholder="Enter patient name" />
        </div>
        <div className="form-field">
          <label>Age</label>
          <input type="number" placeholder="Enter age" />
        </div>
        <div className="form-field">
          <label>Gender</label>
          <select>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-field">
          <label>Phone number</label>
          <input placeholder="Enter phone number" />
        </div>
        <div className="form-field form-field-full">
          <label>Address</label>
          <textarea rows={3} placeholder="Enter address" />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn-primary">Save patient</button>
        <button className="btn-secondary">Clear</button>
      </div>
    </div>
  );
}

export default function Dashboard() {
    const navigate = useNavigate();                          // add this
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // add this
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pageTitle =
    active === 'masterA' ? 'Master A' :
    active === 'masterB' ? 'Master B' :
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
                {dummyStats.map((s) => <StatCard key={s.label} {...s} />)}
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
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPatients.map((p) => (
                        <tr key={p.id}>
                          <td>{p.name}</td>
                          <td className="muted">{p.age}</td>
                          <td className="muted">{p.gender}</td>
                          <td className="muted">{p.phone}</td>
                          <td className="muted">{p.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {active === 'masterA' && <MasterTable title="Master A" apiUrl="https://localhost:7146/api/Doctor" />}
          {active === 'masterB' && <MasterTable title="Master B" apiUrl="https://localhost:7146/api/Doctor"  />}
          {active === 'registration' && <RegistrationForm />}
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
      </>   
  );
}
