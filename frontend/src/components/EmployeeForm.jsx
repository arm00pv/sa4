import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8300/api';

export default function EmployeeForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: 1 // Default for now
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/employees/`, formData, { headers: { 'X-Company-ID': '1' } });
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Error creating employee');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="card modal-content animate-fade-in" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="header" style={{ marginBottom: '1.5rem' }}>
          <h3>Add New Employee</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              required
              className="form-input" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="e.g. Dr. Jane Smith"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              required type="email"
              className="form-input" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              className="form-input" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})} 
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn">Save Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
}
