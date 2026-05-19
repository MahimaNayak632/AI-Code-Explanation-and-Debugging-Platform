
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Settings() {

  const { profilePic } = useProfile();
  const location = useLocation();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/signin");
  };


  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match!");
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/user/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Password updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(" Failed to update password. Please try again.");
    }
    setSaving(false);
  };


  const handleDeleteAccount = async () => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account?"
  );

  if (!confirmDelete) return;

  try {

    const token = localStorage.getItem("token");

    await axios.delete(
      `${API_URL}/api/user/delete-account`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Account deleted successfully");

    navigate("/signup");

  } catch (err) {

    console.error(err);

    alert("Failed to delete account");
  }
};

  return (
    <div className={`min-vh-100 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>

      {/* ================= NAVBAR ================= */}
      <nav className={`navbar navbar-expand-lg ${darkMode ? 'bg-dark border-bottom border-secondary' : 'bg-light border-bottom'}`}>
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center gap-3">
            <button className="btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className={`bi bi-list fs-4 ${darkMode ? 'text-white' : 'text-dark'}`}></i>
            </button>
            {/* <div className="bg-primary text-white px-3 py-1 rounded fw-bold">LOGO</div> */}
            <h5 className="mb-0 fw-bold">AI CODE EXPLAINER</h5>
          </div>

          <div className="d-flex align-items-center gap-4">
            <i className="bi bi-bell fs-5" style={{ cursor: "pointer" }}></i>

            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px" }}
              >
                {profilePic ? (
                  <img src={profilePic} alt="profile" className="rounded-circle" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <i className="bi bi-person text-white"></i>
                )}
              </div>
              <i
                className="bi bi-chevron-down small"
                onClick={() => navigate('/profile')}
                style={{ cursor: "pointer" }}
              ></i>
            </div>
            <i
              className="bi bi-box-arrow-right fs-5 text-danger"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
              title="Logout"
            ></i>
          </div>
        </div>
      </nav>

      {/* ================= BODY ================= */}
      <div className="d-flex" style={{ height: "calc(100vh - 56px)" }}>

        {/* ================= SIDEBAR ================= */}
        <div
          className={`${sidebarOpen ? "col-3" : "col-1"} border-end ${darkMode ? 'bg-dark border-secondary' : 'bg-light'}`}
          style={{ padding: "20px 0", transition: "0.3s" }}
        >
          <div className="px-3">
            <div className="nav flex-column">

              <Link to="/dashboard" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-house-door-fill"></i>
                {sidebarOpen && <span>Dashboard</span>}
              </Link>

              <Link to="/editor" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-code-slash"></i>
                {sidebarOpen && <span>Code Editor</span>}
              </Link>

              {/* <Link to="/debug-explain" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-bug"></i>
                {sidebarOpen && <span>Debug & Explain</span>}
              </Link> */}

              <Link to="/community" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-people"></i>
                {sidebarOpen && <span>Community</span>}
              </Link>

              <Link to="/profile" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-person-circle"></i>
                {sidebarOpen && <span>Profile</span>}
              </Link>

              <Link to="/settings" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 bg-primary text-white`}>
                <i className="bi bi-gear"></i>
                {sidebarOpen && <span>Settings</span>}
              </Link>
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="col p-4 overflow-auto">

          <h2 className="fw-bold mb-4">Settings</h2>

          <div className="row g-4">
            {/* Change Password Section */}
            <div className="col-lg-6">
              <div className={`card shadow-sm ${darkMode ? 'bg-dark border-secondary text-light' : 'bg-white'}`}>
                <div className="card-header fw-bold">
                  <i className="bi bi-lock me-2"></i> Change Password
                </div>
                <div className="card-body">
                  <form onSubmit={handlePasswordChange}>
                    <div className="mb-3">
                      <label className="form-label">Current Password</label>

                      <div className="input-group">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          className="form-control"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />

                        <span
                          className="input-group-text"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className={`bi ${showCurrentPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">New Password</label>

                      <div className="input-group">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          className="form-control"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />

                        <span
                          className="input-group-text"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Confirm New Password</label>

                      <div className="input-group">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />

                        <span
                          className="input-group-text"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </span>
                      </div>
                    </div>

                    {message && (
                      <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} py-2`}>
                        {message}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={saving}
                    >
                      {saving ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div className="col-12">
              <div className={`card shadow-sm ${darkMode ? 'bg-dark border-secondary text-light' : 'bg-white'}`}>
                <div className="card-header fw-bold">
                  <i className="bi bi-person-gear me-2"></i> Account
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <div>
                      <strong>Delete Account</strong>
                      <p className="small text-danger mb-0">This action cannot be undone.</p>
                    </div>
                    <button className="btn btn-outline-danger" onClick={handleDeleteAccount}>Delete Account</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Note */}
          {/* <div className="text-center text-muted small mt-5">
            © 2026 AI Code Explainer Project Team
          </div> */}
        </div>
      </div>
    </div>
  );
}