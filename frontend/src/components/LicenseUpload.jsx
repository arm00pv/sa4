import React, { useState } from 'react';
import axios from 'axios';
import { X, UploadCloud } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8300/api';

export default function LicenseUpload({ employee, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    expiration_date: '',
    file: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('employee', employee.id);
    data.append('title', formData.title);
    data.append('expiration_date', formData.expiration_date);
    if (formData.file) data.append('pdf_file', formData.file);

    try {
      await axios.post(`${API_URL}/licenses/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Error uploading license');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="card modal-content animate-fade-in" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="header" style={{ marginBottom: '1.5rem' }}>
          <h3>Upload Credentials</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          Uploading for: <strong>{employee.name}</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Credential Title</label>
            <input 
              required
              className="form-input" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="e.g. State Dental License"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Expiration Date</label>
            <input 
              required type="date"
              className="form-input" 
              value={formData.expiration_date}
              onChange={e => setFormData({...formData, expiration_date: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Document (PDF/Image)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', border: '1px dashed var(--border-glass)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
              <UploadCloud size={24} color="var(--accent-primary)" />
              <input 
                type="file" 
                onChange={e => setFormData({...formData, file: e.target.files[0]})}
                style={{ color: 'var(--text-secondary)' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn">Secure Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
}
