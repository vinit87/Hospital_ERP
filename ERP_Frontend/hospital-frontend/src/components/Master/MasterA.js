import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import './MasterA.css';

// Usage: <MasterTable title="Master A" apiUrl="https://localhost:7146/api/MasterA" />
const emptyForm = { firstName: '', lastName: '', email: '', department: '', hireDate: '' };

export default function MasterTable({ title, apiUrl }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // modal state — same modal used for both Add and Edit
  const [showForm, setShowForm] = useState(false);
  const [editingRow, setEditingRow] = useState(null); // null = adding new, object = editing existing
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setRows(data);
    } catch (err) {
      console.error(err);
      setError('Could not load records.');
    } finally {
      setLoading(false);
    }
  };

  // ---- Add / Edit ----
  const openAddForm = () => {
    setEditingRow(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  // const openEditForm = (row) => {
  //   setEditingRow(row);
  //   setFormData({
  //     firstName: row.firstName,
  //     lastName: row.lastName,
  //     email: row.email,
  //     department: row.department,
  //     // trim in case API returns a full ISO datetime — <input type="date"> needs YYYY-MM-DD
  //     hireDate: row.hireDate ? row.hireDate.slice(0, 10) : '',
  //   });
  //   setShowForm(true);
  // };

  const openEditForm = (row) => {
    setEditingRow(row);
    setFormData({
      employeeId: row.employeeId,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      department: row.department,
      isActive: row.isActive,
      // trim in case API returns a full ISO datetime — <input type="date"> needs YYYY-MM-DD
      hireDate: row.hireDate ? row.hireDate.slice(0, 10) : '',
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRow(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// const handleSave = async () => {

//     if (!formData.firstName || !formData.lastName || !formData.email) return;

//     // Only check for duplicates when adding a new record (employeeId === 0)
//     // Skip this check while editing, since that record already exists by design
//     if (formData.employeeId === 0) {
//       const isDuplicate = rows.some(
//         (r) => r.email.trim().toLowerCase() === formData.email.trim().toLowerCase()
//       );
//       if (isDuplicate) {
//         alert('Record already exists.');
//         return;
//       }
//     }

//     setSaving(true);
//     try {
//       const payload = {
//         ...formData,
//         hireDate: formData.hireDate ? new Date(formData.hireDate).toISOString() : null,
//       };

//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       if (!response.ok) throw new Error('Save failed');

//       closeForm();
//       fetchData();
//     } catch (err) {
//       console.error(err);
//       alert('Something went wrong while saving. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };
const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) return;

    setSaving(true);
    try {
      const payload = {
        ...formData,
        hireDate: formData.hireDate ? new Date(formData.hireDate).toISOString() : null,
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Save failed');

      const result = await response.json(); // 0 = insert, 1 = update, 2 = already exists

      if (result === 2) {
        alert('This record already exists.');
        return;
      }

      closeForm();
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Something went wrong while saving. Please try again.');
    } finally {
      setSaving(false);
    }
};

  // ---- Delete ----
 const handleDelete = async (employeeId) => {
      if (!window.confirm('Delete this record?')) return;
    try {
      const response = await fetch(`${apiUrl}/${employeeId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      setRows(rows.filter((r) => r.employeeId !== employeeId));
    } catch (err) {
      console.error(err);
      alert('Could not delete this record.');
    }
};

  if (loading) return <div className="panel"><p className="panel-message">Loading...</p></div>;
  if (error) return <div className="panel"><p className="panel-message panel-error">{error}</p></div>;

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>{title}</h3>
          <p className="panel-subtext">Doctor Details </p>
        </div>
        <button className="btn-primary" onClick={openAddForm}>
          <Plus size={16} /> Add new
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Hire date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={6} className="panel-message">No records yet.</td></tr>
            )}
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.firstName}</td>
                <td>{row.lastName}</td>
                <td className="muted">{row.email}</td>
                <td className="muted">{row.department}</td>
                <td className="muted">{row.hireDate ? row.hireDate.slice(0, 10) : ''}</td>
                <td>
                  <div className="row-actions">
                    <button className="icon-btn" onClick={() => openEditForm(row)}>
                      <Pencil size={16} />
                    </button>
                    <button className="icon-btn icon-btn-danger" onClick={() => handleDelete(row.employeeId)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editingRow ? 'Edit record' : 'Add new record'}</h3>
            <div className="form-field">
              <label>First name</label>
              <input name="firstName" value={formData.firstName} onChange={handleFormChange} placeholder="Enter first name" />
            </div>
            <div className="form-field">
              <label>Last name</label>
              <input name="lastName" value={formData.lastName} onChange={handleFormChange} placeholder="Enter last name" />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="Enter email" />
            </div>
            <div className="form-field">
              <label>Department</label>
              <input name="department" value={formData.department} onChange={handleFormChange} placeholder="Enter department" />
            </div>
            <div className="form-field">
              <label>Hire date</label>
              <input type="date" name="hireDate" value={formData.hireDate} onChange={handleFormChange} />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeForm} disabled={saving}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
