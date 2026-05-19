
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Landing() {

  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    codesAnalyzed: 0,
    bugsFixed: 0,
    languages: []
  });

  // Fetch user and stats from backend
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   const storedUser = localStorage.getItem('user');

  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }

  //   if (token) {
  //     axios.get(`${API_URL}/api/code/user/stats`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     })
  //     .then(res => {
  //       setStats(res.data);
  //     })
  //     .catch(err => {
  //       console.log("Stats fetch failed", err);
  //     });
  //   }
  // }, []);
  useEffect(() => {

    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Get stats from localStorage
    const savedStats = JSON.parse(localStorage.getItem("userStats"));

    if (savedStats) {
      setStats({
        codesAnalyzed: savedStats.codesAnalyzed || 0,
        bugsFixed: savedStats.bugsFixed || 0,
        languages: savedStats.languages || []
      });
    }

  }, []);


  return (
    <div className={darkMode ? "bg-dark text-light" : "bg-light text-dark"} style={{ minHeight: "100vh" }}>

      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg bg-light border-bottom">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold text-primary" href="/">AI DEBUGGER</a>

          <div className="ms-auto">
            {/* Dark/Light Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="btn btn-light border d-flex align-items-center gap-2"
            >
              <i className={`bi ${darkMode ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`}></i>
              <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Centered */}
      <section className="py-5" style={{ backgroundColor: darkMode ? "#212529" : "#f8f9fa" }}>
        <div className="container">
          <div className="row justify-content-center">

            {/* Left Content - Centered */}
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold text-primary mb-3">
                Debug Smarter with AI
              </h1>
              <p className="lead mb-4" style={{ color: darkMode ? "#adb5bd" : "#6c757d" }}>
                Understand, Detect and Fix Bugs Instantly
              </p>

              {/* Action Buttons - Centered */}
              <div className="d-flex flex-wrap gap-3 mb-5 justify-content-center">
                <button
                  onClick={() => navigate('/signin')}
                  className="btn btn-outline-primary px-4 py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="btn btn-primary px-4 py-2"
                >
                  Sign Up
                </button>
                {/* <button 
                  onClick={() => navigate('/editor')}
                  className="btn btn-info text-white px-4 py-2"
                >
                  Try Demo
                </button> */}
              </div>

              {/* Features - Centered */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-3 mb-3 justify-content-center">
                  <span className="text-success fs-3"></span>
                  <span className="fs-5">AI Bug Detection</span>
                </div>
                <div className="d-flex align-items-center gap-3 mb-3 justify-content-center">
                  <span className="text-success fs-3"></span>
                  <span className="fs-5">Code Explanation</span>
                </div>
                <div className="d-flex align-items-center gap-3 justify-content-center">
                  <span className="text-success fs-3"></span>
                  <span className="fs-5">Suggested Fixes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome + Stats Section - Centered */}
      {/* <div className="py-5">
        <div className="container">
          <div className="row justify-content-center"> */}

            {/* Main Welcome Area - Centered */}
            {/* <div className="col-lg-8 text-center">
              <h2 className="fw-bold mb-4">
                Welcome {user?.name || 'User'}!
              </h2>

              <div className="row g-4 mb-4 justify-content-center">
                <div className="col-md-4">
                  <div className="bg-white border rounded-3 p-4 shadow-sm">
                    <small className="text-muted">Codes Analyzed</small>
                    <h3 className="fw-bold text-primary">{stats.codesAnalyzed}</h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-white border rounded-3 p-4 shadow-sm">
                    <small className="text-muted">Bugs Fixed</small>
                    <h3 className="fw-bold text-success">{stats.bugsFixed}</h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-white border rounded-3 p-4 shadow-sm">
                    <small className="text-muted">Languages Used</small>
                    <h5 className="fw-bold text-dark">
                      {stats.languages.length > 0
                        ? stats.languages.join(", ")
                        : "No Languages"}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}