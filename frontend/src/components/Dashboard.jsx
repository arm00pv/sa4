import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { differenceInDays, parseISO } from 'date-fns';
import { ShieldCheck, AlertTriangle, XCircle, Plus, FileUp, Users, Download, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import EmployeeForm from './EmployeeForm';
import LicenseUpload from './LicenseUpload';

const API_URL = 'http://127.0.0.1:8300/api';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmpForm, setShowEmpForm] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const navigate = useNavigate();

  const getAxiosConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/employees/`, getAxiosConfig());
      setEmployees(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
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

  const downloadReport = async () => {
    try {
      const response = await axios.get(`${API_URL}/employees/export_csv/`, {
        ...getAxiosConfig(),
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'compliance_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download report', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="dashboard-container">Loading...</div>;

  // Calculate Chart Data
  let compliant = 0; let warning = 0; let expired = 0;
  employees.forEach(emp => {
    const s = getComplianceStatus(emp.licenses).status;
    if (s === 'green') compliant++;
    else if (s === 'yellow') warning++;
    else if (s === 'red') expired++;
  });
  const chartData = [
    { name: 'Compliant', value: compliant, color: '#10b981' },
    { name: 'Expiring Soon', value: warning, color: '#f59e0b' },
    { name: 'Action Required', value: expired, color: '#ef4444' }
  ].filter(d => d.value > 0);

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="header">
        <div>
          <h1 className="title">Compliance Tracker</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Proactive monitoring of vital staff credentials.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={handleLogout}><LogOut size={16} /> Logout</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card delay-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>No data to display</div>
          )}
        </div>
        <div className="card delay-2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Total Employees</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold' }}>{employees.length}</p>
        </div>
      </div>

      <div className="card delay-3">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={20} /> Staff Directory</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={downloadReport}><Download size={16} /> Export CSV</button>
            <button className="btn" onClick={() => setShowEmpForm(true)}><Plus size={16} /> Add Employee</button>
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Contact</th>
                <th>Licenses</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const compStatus = getComplianceStatus(emp.licenses);
                return (
                  <tr key={emp.id}>
                    <td style={{ fontWeight: 500 }}>{emp.name}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{emp.email}</td>
                    <td>{emp.licenses?.length || 0}</td>
                    <td>
                      <span className={`badge ${compStatus.status}`} style={{ gap: '0.25rem' }}>
                        {compStatus.icon} {compStatus.text}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }} onClick={() => setSelectedEmp(emp)}>
                        <FileUp size={14} /> Upload
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showEmpForm && <EmployeeForm onClose={() => setShowEmpForm(false)} onSuccess={() => { setShowEmpForm(false); fetchEmployees(); }} getAxiosConfig={getAxiosConfig} />}
      {selectedEmp && <LicenseUpload employee={selectedEmp} onClose={() => setSelectedEmp(null)} onSuccess={() => { setSelectedEmp(null); fetchEmployees(); }} getAxiosConfig={getAxiosConfig} />}
    </div>
  );
}
