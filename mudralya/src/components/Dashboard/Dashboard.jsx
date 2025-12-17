import React, { useEffect, useState } from 'react';
import { request } from '../../api/client';
import AdminLayout from './AdminLayout';
import StatsOverview from './StatsOverview';
import DataTable from './DataTable';
import TaskManager from './TaskManager';
import './DashboardLayout.css'; // New Styles

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const Dashboard = () => {
  const defaultUsername = import.meta.env.VITE_DASHBOARD_USER || '';
  const [authToken, setAuthToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncingPayments, setSyncingPayments] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Login State
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState('');

  const fetchDashboard = async (token = authToken) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await request('/api/dashboard', { includeCredentials: true });
      setData(res);
    } catch (err) {
      if (err.status === 401) {
        setAuthToken('');
        localStorage.removeItem('isAdminLoggedIn');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check Session
    const checkSession = async () => {
      const wasLoggedIn = localStorage.getItem('isAdminLoggedIn');
      if (wasLoggedIn) {
        setAuthToken('active');
        fetchDashboard('active');
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await request('/api/admin/login', {
        method: 'POST',
        data: { username, password },
        includeCredentials: true
      });
      setAuthToken('active');
      localStorage.setItem('isAdminLoggedIn', 'true');
      fetchDashboard('active');
    } catch (err) {
      setError(err.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await request('/api/admin/logout', { method: 'POST', includeCredentials: true });
    } catch (err) { /* ignore */ }
    setAuthToken('');
    localStorage.removeItem('isAdminLoggedIn');
    setData(null);
  };

  const handleSyncPayments = async () => {
    if (syncingPayments) return;
    setSyncingPayments(true);
    try {
      const res = await request('/api/payment/sync', {
        method: 'POST',
        includeCredentials: true,
        data: { limit: 200 }
      });

      await fetchDashboard('active');
      alert(`Payment sync complete: ${res.updated || 0} updated (scanned ${res.scanned || 0}). Errors: ${(res.errors || []).length}`);
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        alert('Session expired. Please log in again and retry.');
      } else {
        const details = [err.data?.error, err.data?.message].filter(Boolean).join(': ');
        alert(details || err.message || 'Payment sync failed');
      }
    } finally {
      setSyncingPayments(false);
    }
  };

  // Columns Definition
  const joinColumns = [
    { key: 'fullName', label: 'Name' },
    { key: 'mobileNumber', label: 'Mobile' },
    { key: 'emailId', label: 'Email' },
    { key: 'profession', label: 'Profession' },
    {
      key: 'payment_status',
      label: 'Pay Status',
      format: (val) => <span className={`badge ${val === 'Paid' ? 'bg-success' : 'bg-warning text-dark'}`}>{val || 'Pending'}</span>
    },
    { key: 'razorpay_payment_id', label: 'Pay ID' },
    { key: 'razorpay_order_id', label: 'Order ID' },
    { key: 'createdAt', label: 'Registered', format: formatDate }
  ];

  const contactColumns = [
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'subject', label: 'Subject' },
    { key: 'createdAt', label: 'Date', format: formatDate }
  ];

  const advisorColumns = [
    { key: 'fullName', label: 'Name' },
    { key: 'mobileNumber', label: 'Mobile' },
    { key: 'irdaLicense', label: 'IRDA License' },
    { key: 'createdAt', label: 'Date', format: formatDate }
  ];

  // Login View
  if (!authToken) {
    return (
      <div className="login-container d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', background: '#f8f9fa' }}>
        <div className="card shadow-lg border-0" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <img src="/images/mudralya_logo.webp" alt="Logo" height="50" className="mb-3" />
              <h4 className="fw-bold text-dark">Admin Portal</h4>
              <p className="text-muted small">Sign in to manage dashboard</p>
            </div>
            {error && <div className="alert alert-danger py-2 mb-3 small">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username} onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="btn btn-primary w-100 fw-bold py-2" disabled={loading}>
                {loading ? <div className="spinner-border spinner-border-sm"></div> : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = async (type, id) => {
    setLoading(true);
    try {
      let endpoint = '';
      if (type === 'join') endpoint = `/api/join/${id}`;
      if (type === 'contact') endpoint = `/api/contact/${id}`;
      if (type === 'advisor') endpoint = `/api/advisor/${id}`;

      await request(endpoint, {
        method: 'DELETE',
        includeCredentials: true
      });

      // Refresh Data
      fetchDashboard('active');
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete entry');
    } finally {
      setLoading(false);
    }
  };

  // Authenticated Layout
  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {activeTab === 'overview' && (
        <>
          <StatsOverview data={data} />
          <div className="row mt-4">
            <div className="col-lg-8">
              <DataTable
                title="Recent Registrations"
                columns={joinColumns}
                data={data?.joinRequests?.slice(0, 5) || []}
                onDelete={(id) => handleDelete('join', id)}
              />
            </div>
            <div className="col-lg-4">
              {/* Simple Activity Feed or Smaller Table */}
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white py-3">
                  <h6 className="mb-0 fw-bold">Recent Messages</h6>
                </div>
                <div className="list-group list-group-flush">
                  {data?.contacts?.slice(0, 5).map((msg, i) => (
                    <div key={i} className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <small className="fw-bold">{msg.fullName}</small>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>{formatDate(msg.createdAt).split(',')[0]}</small>
                      </div>
                      <p className="mb-0 small text-truncate text-muted">{msg.subject || 'No subject'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'join' && (
        <>
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleSyncPayments}
              disabled={syncingPayments}
            >
              {syncingPayments ? 'Syncing Payments...' : 'Sync Razorpay Payments'}
            </button>
          </div>
          <DataTable
            title="Join Partnership Requests"
            columns={joinColumns}
            data={data?.joinRequests || []}
            onDelete={(id) => handleDelete('join', id)}
          />
        </>
      )}

      {activeTab === 'contacts' && (
        <DataTable
          title="Contact Inquiries"
          columns={contactColumns}
          data={data?.contacts || []}
          onDelete={(id) => handleDelete('contact', id)}
        />
      )}

      {activeTab === 'advisor' && (
        <DataTable
          title="Advisor Applications"
          columns={advisorColumns}
          data={data?.advisorApplications || []}
          onDelete={(id) => handleDelete('advisor', id)}
        />
      )}

      {activeTab === 'tasks' && (
        <TaskManager />
      )}
    </AdminLayout>
  );
};

export default Dashboard;
