import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
export default function Community() {
  const { darkMode } = useTheme();
  const { profilePic } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLang, setFilterLang] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/signin");
  };


  // Fetch public codes
  useEffect(() => {
    const fetchCommunityCodes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/community/codes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCodes(res.data);
      } catch (err) {
        console.log("Backend not connected yet → using mock data");
        setCodes([
          {
            id: 1,
            title: "Array Sum with Error",
            language: "java",
            codeSnippet: "for(int i=0; i<=arr.length; i++) ...",
            likes: 24,
            views: 142,
            comments: 7,
            author: "CodeMaster",
            time: "2 hours ago",
            description: "Help! Getting ArrayIndexOutOfBoundsException"
          },
          {
            id: 2,
            title: "Palindrome Checker",
            language: "python",
            codeSnippet: "def is_palindrome(s): ...",
            likes: 45,
            views: 320,
            comments: 12,
            author: "Devika",
            time: "Yesterday",
            description: "Clean Python solution"
          }
        ]);
      }
      setLoading(false);
    };

    fetchCommunityCodes();
  }, []);

  const filteredCodes = codes
    .filter(code => filterLang === 'All' || code.language.toLowerCase() === filterLang.toLowerCase())
    .sort((a, b) => sortBy === 'popular' ? (b.likes || 0) - (a.likes || 0) : 0);

  const languageOptions = ['All', 'Java', 'Python', 'Cpp', 'C', 'JavaScript'];

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

        {/* SIDEBAR */}
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

              <Link to="/community" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 bg-primary text-white`}>
                <i className="bi bi-people"></i>
                {sidebarOpen && <span>Community</span>}
              </Link>

              <Link to="/profile" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-person-circle"></i>
                {sidebarOpen && <span>Profile</span>}
              </Link>

              <Link to="/settings" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-gear"></i>
                {sidebarOpen && <span>Settings</span>}
              </Link>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="col p-4 overflow-auto">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Community Shared Codes</h2>
            <Link to="/editor" className="btn btn-primary px-4">
              <i className="bi bi-plus-circle me-2"></i> Share Your Code
            </Link>
          </div>

          {/* Filters */}
          <div className="row mb-4 g-3">
            <div className="col-md-6">
              <select className="form-select" value={filterLang} onChange={(e) => setFilterLang(e.target.value)}>
                {languageOptions.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="popular">Most Popular</option>
                <option value="recent">Recently Shared</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : filteredCodes.length === 0 ? (
            <p className="text-center text-muted py-5">No public codes yet. Be the first to share from Editor!</p>
          ) : (
            <div className="row g-4">
              {filteredCodes.map((code) => (
                <div key={code.id} className="col-lg-6 col-xl-4">
                  <div className={`card h-100 shadow-sm ${darkMode ? 'bg-dark border-secondary text-light' : 'bg-white'}`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <span className={`badge bg-${code.language === 'java' ? 'warning' : code.language === 'python' ? 'success' : 'info'}`}>
                          {code.language.toUpperCase()}
                        </span>
                        <small className="text-muted">{code.time}</small>
                      </div>

                      <h5 className="card-title">{code.title}</h5>
                      <p className="card-text small text-muted">{code.description}</p>

                      {/* <pre className="bg-black text-success p-3 rounded small overflow-auto" style={{ maxHeight: "110px" }}>
                        {code.codeSnippet || code.code?.substring(0, 150) + "..."}
                      </pre> */}
                      <pre
                        className="bg-black text-success p-3 rounded overflow-auto"
                        style={{
                          maxHeight: "400px",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word"
                        }}
                      >
                        {code.code || code.codeSnippet}
                      </pre>

                      <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                        <div className="d-flex gap-4 small">
                          <span><i className="bi bi-heart-fill text-danger"></i> {code.likes || 0}</span>
                          <span><i className="bi bi-eye"></i> {code.views || 0}</span>
                          <span><i className="bi bi-chat"></i> {code.comments || 0}</span>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            navigate('/debug-explain', {
                              state: {
                                code: code.code || code.codeSnippet,
                                language: code.language
                              }
                            })
                          }
                        >
                          View & Debug
                        </button>
                      </div>
                    </div>
                    <div className="card-footer small text-muted">
                      by {code.author || 'Anonymous'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* <div className="text-center text-muted small mt-5">
            © 2026 AI Code Explainer Project Team
        </div> */}
    </div>
  );
}