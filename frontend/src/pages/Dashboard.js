import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from "../context/ProfileContext";
import { Link, useLocation } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true); //  sidebar state
  const { profilePic } = useProfile();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    codesAnalyzed: 0,
    bugsFixed: 0,
    languages: []
  });

  const [recentActivity, setRecentActivity] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/signin");
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // GET SAVED STATS
    const savedStats = localStorage.getItem("userStats");

    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    if (token) {
      axios.get(`${API_URL}/api/code/user/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setStats(res.data))
        .catch(err => console.log("Stats fetch failed", err));

      setRecentActivity([
        { text: "Last Code Run", value: "2 hours ago" },
        { text: "Errors Fixed", value: "12 bugs fixed", color: "text-success" },
        { text: "Recent Submissions", value: "Array Index Error Debug" }
      ]);
    }

  }, []);
  return (
    <div className={`min-vh-100 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>

      {/* ================= NAVBAR ================= */}
      <nav className={`navbar navbar-expand-lg ${darkMode ? 'bg-dark border-bottom border-secondary' : 'bg-light border-bottom'}`}>
        <div className="container-fluid px-4">

          {/* LEFT SIDE */}
          <div className="d-flex align-items-center gap-3">

            {/* ☰ Hamburger */}
            <button className="btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className={`bi bi-list fs-4 ${darkMode ? 'text-white' : 'text-dark'}`}></i>
            </button>

            {/* <div className="bg-primary text-white px-3 py-1 rounded fw-bold">LOGO</div> */}
            <h5 className="mb-0 fw-bold">AI CODE EXPLAINER</h5>
          </div>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-4">

            {/* Notification */}
            <i
              className="bi bi-bell fs-5"
              onClick={() => navigate('/notifications')}
              style={{ cursor: "pointer" }}
            ></i>

            {/* Profile */}
            <div className="d-flex align-items-center gap-2">

              <div
                className="bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px" }}>
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="profile"
                    className="rounded-circle"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
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

              {/* DASHBOARD */}
              <Link
                to="/dashboard"
                className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 
        ${location.pathname === '/dashboard'
                    ? 'bg-primary text-white'
                    : darkMode ? 'text-white' : 'text-dark'}`}
              >
                <i className="bi bi-house-door-fill"></i>
                {sidebarOpen && <span>Dashboard</span>}
              </Link>

              {/* CODE EDITOR */}
              <Link
                to="/editor"
                className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 
        ${location.pathname === '/editor'
                    ? 'bg-primary text-white'
                    : darkMode ? 'text-white' : 'text-dark'}`}
              >
                <i className="bi bi-code-slash"></i>
                {sidebarOpen && <span>Code Editor</span>}
              </Link>

              {/* DEBUG & EXPLAIN */}
              {/* <Link
        to="/debug-explain"
        className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 
        ${location.pathname === '/debug-explain'
          ? 'bg-primary text-white'
          : darkMode ? 'text-white' : 'text-dark'}`}
      >
        <i className="bi bi-bug"></i>
        {sidebarOpen && <span>Debug & Explain</span>}
      </Link> */}

              {/* COMMUNITY */}
              <Link
                to="/community"
                className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 
        ${location.pathname === '/community'
                    ? 'bg-primary text-white'
                    : darkMode ? 'text-white' : 'text-dark'}`}
              >
                <i className="bi bi-people"></i>
                {sidebarOpen && <span>Community</span>}
              </Link>

              {/* PROFILE */}
              <Link
                to="/profile"
                className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 
        ${location.pathname === '/profile'
                    ? 'bg-primary text-white'
                    : darkMode ? 'text-white' : 'text-dark'}`}
              >
                <i className="bi bi-person-circle"></i>
                {sidebarOpen && <span>Profile</span>}
              </Link>

              {/* SETTINGS */}
              <Link
                to="/settings"
                className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 
        ${location.pathname === '/settings'
                    ? 'bg-primary text-white'
                    : darkMode ? 'text-white' : 'text-dark'}`}
              >
                <i className="bi bi-gear"></i>
                {sidebarOpen && <span>Settings</span>}
              </Link>

            </div>
          </div>
        </div>
        {/* ================= MAIN CONTENT ================= */}
        <div className={`${sidebarOpen ? "col-9" : "col-11"} p-5 overflow-auto`}>

          <h2 className="fw-bold mb-4">
            Welcome, {user?.name?.split(' ')[0] || 'User'}!
          </h2>

          {/* Quick Start */}
          <button
            onClick={() => navigate('/editor')}
            className="btn btn-primary btn-lg px-5 py-3 rounded-pill mb-5"
          >
            Quick Start →
          </button>

          {/* Recent Activity */}
          <div className={`card mb-5 ${darkMode ? 'bg-dark border-secondary' : 'bg-white'}`}>
            <div className={`card-header fw-bold ${darkMode ? 'bg-secondary text-light' : 'bg-light'}`}>
              Recent Activity
            </div>

            <div className="card-body">
              <ul className="list-unstyled">
                {recentActivity.map((item, index) => (
                  <li key={index} className="mb-3">
                    • {item.text}: <span className={item.color || 'text-muted'}>{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stats */}
          <div className={`card ${darkMode ? 'bg-dark border-secondary' : 'bg-white'}`}>
            <div className={`card-header fw-bold ${darkMode ? 'bg-secondary text-light' : 'bg-light'}`}>
              Your Status
            </div>

            <div className="card-body">
              <div className="row text-center">

                <div className="col-md-4 mb-4">
                  <strong className="text-white">Codes Analyzed</strong><br />
                  <span className="fs-4 fw-bold text-primary">{stats.codesAnalyzed}</span>
                </div>

                <div className="col-md-4 mb-4">
                  <strong className="text-white">Bugs Fixed</strong><br />
                  <span className="fs-4 fw-bold text-success">{stats.bugsFixed}</span>
                </div>

                <div className="col-md-4 mb-4">
                  <strong className="text-white">Languages Used</strong><br />
                  <span className="fs-5 fw-bold text-light">
                    {stats.languages.length > 0
                      ? stats.languages.join(", ")
                      : "No Languages"}
                  </span>
                </div>

              </div>

              <button
                onClick={() => navigate('/editor')}
                className="btn btn-outline-primary w-100 mt-3"
              >
                Continue Last Code →
              </button>
            </div>
          </div>

        </div>
      </div>
      <div className="text-center text-muted small mt-5">
        © 2026 AI Code Explanation and Debugging platform, All Rights are Reserved
      </div>
    </div>
  );
}  
