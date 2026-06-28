import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { differenceInDays, parseISO } from 'date-fns';
import { ShieldCheck, AlertTriangle, XCircle, Plus, FileUp, Users } from 'lucide-react';
import EmployeeForm from './EmployeeForm';
import LicenseUpload from './LicenseUpload';

const API_URL = 'http://127.0.0.1:8300/api';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmpForm, setShowEmpForm] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/employees/`);
      setEmployees(response.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const getComplianceStatus = (licenses) => {
    if (!licenses || licenses.length === 0) return { status: 'red', text: 'No Licenses', icon: <XCircle size={16} /> };
    
    let worstStatus = { status: 'green', text: 'Compliant', icon: <ShieldCheck size={16} /> };
    
    for (const lic of licenses) {
      const daysLeft = differenceInDays(parseISO(lic.expiration_date), new Date());
      if (daysLeft < 0) return { status: 'red', text: 'Expired', icon: <XCircle size={16} /> };
      if (daysLeft < 30) worstStatus = { status: 'red', text: '< 30 Days', icon: <AlertTriangle size={16} /> };
      else if (daysLeft <= 60 && worstStatus.status !== 'red') worstStatus = { status: 'yellow', text: 'Expiring Soon', icon: <AlertTriangle size={16} /> };
    }
    return worstStatus;
  };

  if (loading) return <div className="dashboard-container">Loading...</div>;

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="header">
        <div>
          <h1 className="title">Compliance & License Tracker</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Monitor and manage vital staff credentials proactively.</p>
        </div>
        <button className="btn" onClick={() => setShowEmpForm(true)}>
          <Plus size={18} /> Add Employee
        </button>
      </header>

      <div className="card delay-1">
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} className="text-accent" /> Staff Directory
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Email / Phone</th>
                <th>Active Licenses</th>
                <th>Compliance Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center'}}>No employees found.</td></tr>
              ) : (
                employees.map(emp => {
                  const compStatus = getComplianceStatus(emp.licenses);
                  return (
                    <tr key={emp.id}>
                      <td style={{ fontWeight: 500 }}>{emp.name}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        <div>{emp.email}</div>
                        <div>{emp.phone}</div>
                      </td>
                      <td>{emp.licenses?.length || 0} credentials</td>
                      <td>
                        <span className={`badge ${compStatus.status}`} style={{ gap: '0.25rem' }}>
                          {compStatus.icon} {compStatus.text}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-secondary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                          onClick={() => setSelectedEmp(emp)}
                        >
                          <FileUp size={14} /> Upload License
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showEmpForm && (
        <EmployeeForm 
          onClose={() => setShowEmpForm(false)} 
          onSuccess={() => { setShowEmpForm(false); fetchEmployees(); }} 
        />
      )}

      {selectedEmp && (
        <LicenseUpload 
          employee={selectedEmp}
          onClose={() => setSelectedEmp(null)}
          onSuccess={() => { setSelectedEmp(null); fetchEmployees(); }}
        />
      )}
    </div>
  );
}
