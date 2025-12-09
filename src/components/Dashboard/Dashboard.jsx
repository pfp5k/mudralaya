import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { request } from '../../api/client';

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const Dashboard = () => {
  const defaultUsername = import.meta.env.VITE_DASHBOARD_USER || '';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSheet, setActiveSheet] = useState('contacts');
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState('');

  const fetchDashboard = async (token = authToken) => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await request('/api/dashboard', {
        includeCredentials: true
      });
      setData(res);
    } catch (err) {
      setError(err.data?.error || err.message || 'Failed to load dashboard');
      if (err.status === 401) {
        setAuthToken('');
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await request('/api/admin/session', { includeCredentials: true });
        setAuthToken('active');
        setData(null);
        setError('');
        setActiveSheet('contacts');
        setTimeout(() => {
          fetchDashboard('active');
        }, 0);
        setUsername(res.user || '');
      } catch (err) {
        setAuthToken('');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const doLogin = async () => {
      setLoading(true);
      setError('');
      try {
        await request('/api/admin/login', {
          method: 'POST',
          data: { username, password },
          includeCredentials: true
        });
        setAuthToken('active');
        setData(null);
        setError('');
        setPassword('');
        fetchDashboard('active');
      } catch (err) {
        setError(err.data?.error || err.message || 'Login failed');
        setAuthToken('');
      } finally {
        setLoading(false);
      }
    };
    doLogin();
  };

  const handleLogout = () => {
    const doLogout = async () => {
      try {
        await request('/api/admin/logout', { method: 'POST', includeCredentials: true });
      } catch (err) {
        // ignore
      }
      setAuthToken('');
      setUsername('');
      setPassword('');
      setData(null);
      setError('');
    };
    doLogout();
  };

  const sheets = [
    {
      id: 'contacts',
      title: 'Contact Requests',
      count: data?.counts?.contacts || 0,
      columns: [
        { key: 'fullName', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phoneNumber', label: 'Phone' },
        { key: 'subject', label: 'Subject' },
        { key: 'occupation', label: 'Occupation' },
        { key: 'qualification', label: 'Qualification' },
        { key: 'createdAt', label: 'Created', format: formatDate }
      ],
      rows: data?.contacts || []
    },
    {
      id: 'join',
      title: 'Join Requests',
      count: data?.counts?.joinRequests || 0,
      columns: [
        { key: 'fullName', label: 'Name' },
        { key: 'mobileNumber', label: 'Mobile' },
        { key: 'emailId', label: 'Email' },
        { key: 'profession', label: 'Profession' },
        { key: 'dateOfBirth', label: 'DOB' },
        { key: 'createdAt', label: 'Created', format: formatDate }
      ],
      rows: data?.joinRequests || []
    },
    {
      id: 'advisor',
      title: 'Advisor Applications',
      count: data?.counts?.advisorApplications || 0,
      columns: [
        { key: 'fullName', label: 'Name' },
        { key: 'mobileNumber', label: 'Mobile' },
        { key: 'emailId', label: 'Email' },
        { key: 'profession', label: 'Profession' },
        { key: 'irdaLicense', label: 'IRDAI' },
        { key: 'dateOfBirth', label: 'DOB' },
        { key: 'createdAt', label: 'Created', format: formatDate }
      ],
      rows: data?.advisorApplications || []
    },
    {
      id: 'newsletter',
      title: 'Newsletter Subs',
      count: data?.counts?.newsletterSubscriptions || 0,
      columns: [
        { key: 'email', label: 'Email' },
        { key: 'createdAt', label: 'Created', format: formatDate }
      ],
      rows: data?.newsletterSubscriptions || []
    }
  ];

  const activeSheetData = sheets.find((sheet) => sheet.id === activeSheet) || sheets[0];

  return (
    <div className="container py-5 dashboard-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div>
          <h2 className="mb-1">Submissions Dashboard</h2>
          <p className="text-muted mb-0">Excel-style sheets for each form.</p>
        </div>
        <button className="btn btn-outline-primary" onClick={fetchDashboard} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {!authToken && (
        <div className="card login-card">
          <div className="card-body">
            <h5 className="card-title mb-3">Admin Login</h5>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form className="row g-2" onSubmit={handleLogin}>
              <div className="col-12 col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-4">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-4 d-flex align-items-center">
                <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {authToken && (
        <>
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          )}

          {data && (
        <>
          <div className="row g-3 mb-3">
            {sheets.map((card) => (
              <div className="col-6 col-md-3" key={card.id}>
                <div className="card stat-card">
                  <div className="card-body">
                    <p className="text-muted mb-1">{card.title}</p>
                    <h4 className="mb-0">{card.count}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="sheet-tabs">
            {sheets.map((sheet) => (
              <button
                key={sheet.id}
                type="button"
                className={`sheet-tab ${activeSheet === sheet.id ? 'active' : ''}`}
                onClick={() => setActiveSheet(sheet.id)}
              >
                <span className="sheet-title">{sheet.title}</span>
                <span className="sheet-count badge">{sheet.count}</span>
              </button>
            ))}
          </div>

          <div className="sheet-surface">
            <div className="d-flex justify-content-between align-items-center sheet-header">
              <div>
                <h5 className="mb-0">{activeSheetData.title}</h5>
                <small className="text-muted">Rows: {activeSheetData.rows.length}</small>
              </div>
              <div className="text-muted small">Auto-refresh via Refresh button</div>
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={fetchDashboard} disabled={loading}>
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
            <div className="table-responsive sheet-table">
              <table className="table table-sm mb-0 align-middle">
                <thead>
                  <tr>
                    <th className="row-number-col">#</th>
                    {activeSheetData.columns.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeSheetData.rows.length === 0 && (
                    <tr>
                      <td colSpan={activeSheetData.columns.length + 1} className="text-center text-muted">
                        No records yet
                      </td>
                    </tr>
                  )}
                  {activeSheetData.rows.map((row, idx) => (
                    <tr key={row._id || idx}>
                      <td className="row-number-col text-muted">{idx + 1}</td>
                      {activeSheetData.columns.map((col) => (
                        <td key={col.key}>
                          {col.format ? col.format(row[col.key], row) : row[col.key] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
