import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useProfile } from "../context/ProfileContext";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ GLOBAL IMAGE
  const { profilePic, setProfilePic } = useProfile();

  //  EDIT MODE
  const [isEditing, setIsEditing] = useState(false);

  //  USER STATE
  const [user, setUser] = useState({
    name: "CodeMaster",
    email: "codemaster@gmail.com",
    gender: "Male",
    bio: "Coding enthusiast | Love learning new things | Coffee lover",
    password: ""
  });

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/signin");
};


  //  FETCH USER (BACKEND READY)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_URL}/api/user/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data);
      } catch {
        console.log("Using dummy data");
      }
    };

    fetchUser();
  }, []);

  //  HANDLE CHANGE
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  //  SAVE
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/user/profile`,
        user,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated successfully ✅");
      setIsEditing(false);
    } catch {
      alert("Saved locally (backend not connected)");
      setIsEditing(false);
    }
  };

  // ✅ IMAGE UPLOAD (TEMP)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfilePic(imageURL);
    }
  };

  return (
    <div className={`min-vh-100 ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>

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
                    style={{ width: "100%", height: "100%", objectFit: "cover"  }}
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

        {/* ================= MAIN ================= */}
        <div className="col p-4">

          <div className="card p-4 shadow">

            {/* IMAGE */}
            <div
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-3"
              style={{ width: "100px", height: "100px", cursor: "pointer" }}
              onClick={() => document.getElementById("profileInput").click()}
            >
              {profilePic ? (
                <img src={profilePic} className="rounded-circle" style={{ width: "100%", height: "100%" }} />
              ) : (
                <i className="bi bi-person text-white fs-1"></i>
              )}
            </div>

            <input
              type="file"
              id="profileInput"
              className="d-none"
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* ================= FORM ================= */}
            {isEditing ? (
              <div>

                <label className="form-label">Full Name</label>
                <input
                  className="form-control mb-3"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                />

                <label className="form-label">Email</label>
                <input
                  className="form-control mb-3"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />

                <label className="form-label">Gender</label>
                <select
                  className="form-control mb-3"
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                >
                  <option>select the gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                <label className="form-label">Bio</label>
                <textarea
                  className="form-control mb-3"
                  name="bio"
                  value={user.bio}
                  onChange={handleChange}
                />

                

                <div className="d-flex gap-2">
                  <button className="btn btn-success w-50" onClick={handleSave}>
                    Save
                  </button>
                  <button className="btn btn-secondary w-50" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>

              </div>
            ) : (
              <>
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p>{user.bio}</p>

                <button className="btn btn-primary mt-2" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              </>
            )}

          </div>

        </div>
      </div>
       {/* <div className="text-center text-muted small mt-5">
            © 2026 AI Code Explainer Project Team
        </div> */}
    </div>
    
  );
}