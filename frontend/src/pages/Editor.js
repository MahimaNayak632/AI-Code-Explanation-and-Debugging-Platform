
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function CodeEditor() {

  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();
  const { profilePic } = useProfile();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Main States
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  // const [loadingRun, setLoadingRun] = useState(false);

  // Share Modal States
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTitle, setShareTitle] = useState('');
  const [shareDescription, setShareDescription] = useState('');
  const [sharing, setSharing] = useState(false);


  const [aiResult, setAiResult] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);



  const [error, setError] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  // ================= TEMPLATES =================
  useEffect(() => {
    // If coming from debug page → don't override
    if (location.state?.code) return;

    // ALWAYS change template when language changes
    // setCode(templates[language]);

    // Also update localStorage so old Java code is not reused
    // localStorage.setItem("editor_code", templates[language]);

  }, [language]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const saveCodeStats = () => {

    // Get old stats
    const oldStats = JSON.parse(localStorage.getItem("stats")) || {
      codesAnalyzed: 0,
      bugsFixed: 0,
      languages: []
    };

    // Increase code analyzed count
    oldStats.codesAnalyzed += 1;

    // Add current language if not already added
    if (!oldStats.languages.includes(language)) {
      oldStats.languages.push(language);
    }

    // Simple bug fixed logic
    if (code.toLowerCase().includes("fix") || code.toLowerCase().includes("error")) {
      oldStats.bugsFixed += 1;
    }

    // Save updated stats
    localStorage.setItem("stats", JSON.stringify(oldStats));

    alert("✅ Code Saved Successfully!");
  };



  // SHARE TO COMMUNITY
  const shareToCommunity = async () => {
    if (!code.trim()) {
      alert("Please write some code before sharing!");
      return;
    }
    if (!shareTitle.trim()) {
      alert("Please enter a Code Title!");
      return;
    }

    setSharing(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/api/code/share`, {
        title: shareTitle,
        description: shareDescription || "No description provided",
        code: code,
        language: language,
        isPublic: true
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Code shared to Community successfully!");
      setShowShareModal(false);
      setShareTitle('');
      setShareDescription('');
    } catch (err) {
      console.error(err);
      alert("Failed to share. Please make sure you are logged in.");
    }
    setSharing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      setError("Please paste some code to explain");
      return;
    }

    setLoadingAI(true);
    setError(null);
    setExplanation(null);
    setShowExplanation(false);

    try {
      const response = await fetch(`${API_URL}/api/code/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code: code.trim(),
          language
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to explain code");
      }

      console.log("AI RESPONSE:", data); // 🔥 debug

      setAiResult(data);
      setExplanation(data.explanation);
      setShowExplanation(true);

    } catch (err) {
      console.error(err);
      setError(err.message || "Server error. Check backend.");
    } finally {
      setLoadingAI(false);
    }
  };



  const saveStats = () => {

    //   const existingStats = JSON.parse(localStorage.getItem("userStats")) || {
    //     codesAnalyzed: 0,
    //     bugsFixed: 0,
    //     languages: []
    //   };

    //   // increment analyzed count
    //   existingStats.codesAnalyzed += 1;

    //   // increment bug fixed count
    //   existingStats.bugsFixed += 1;

    //   // add language if not already added
    //   if (!existingStats.languages.includes(language)) {
    //     existingStats.languages.push(language);
    //   }

    //   localStorage.setItem("userStats", JSON.stringify(existingStats));

    //   alert("Stats Saved Successfully!");
    // };
    // ================= SAVE STATS =================
    const existingStats = JSON.parse(localStorage.getItem("userStats")) || {
      codesAnalyzed: 0,
      bugsFixed: 0,
      languages: []
    };

    existingStats.codesAnalyzed += 1;
    existingStats.bugsFixed += 1;

    if (!existingStats.languages.includes(language)) {
      existingStats.languages.push(language);
    }

    localStorage.setItem(
      "userStats",
      JSON.stringify(existingStats)
    );

    // ================= SAVE CODE =================
    const savedCodes =
      JSON.parse(localStorage.getItem("savedCodes")) || [];

    const newCode = {
      id: Date.now(),
      language: language,
      code: code,
      createdAt: new Date().toLocaleString()
    };

    savedCodes.push(newCode);

    localStorage.setItem(
      "savedCodes",
      JSON.stringify(savedCodes)
    );

    alert("✅ Code Saved Successfully!");
  };


  return (
    <div className={`min-vh-100 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>

      {/* NAVBAR */}
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

      {/* BODY */}
      <div className="d-flex" style={{ height: "calc(100vh - 56px)" }}>

        {/* SIDEBAR - same as before */}
        <div className={`${sidebarOpen ? "col-3" : "col-1"} border-end ${darkMode ? 'bg-dark border-secondary' : 'bg-light'}`} style={{ padding: "20px 0", transition: "0.3s" }}>
          <div className="px-3">
            <div className="nav flex-column">
              <Link to="/dashboard" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 ${location.pathname === '/dashboard' ? 'bg-primary text-white' : darkMode ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-house-door-fill"></i>
                {sidebarOpen && <span>Dashboard</span>}
              </Link>
              <Link to="/editor" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 ${location.pathname === '/editor' ? 'bg-primary text-white' : darkMode ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-code-slash"></i>
                {sidebarOpen && <span>Code Editor</span>}
              </Link>
              {/* <Link to="/debug-explain" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 ${location.pathname === '/debug-explain' ? 'bg-primary text-white' : darkMode ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-bug"></i>
                {sidebarOpen && <span>Debug & Explain</span>}
              </Link> */}
              <Link
                to="/saved-codes"
                className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 
  ${location.pathname === '/saved-codes'
                    ? 'bg-primary text-white'
                    : darkMode ? 'text-white' : 'text-dark'}`}
              >
                <i className="bi bi-save"></i>
                {sidebarOpen && <span>Saved Codes</span>}
              </Link>
              <Link to="/community" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 ${location.pathname === '/community' ? 'bg-primary text-white' : darkMode ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-people"></i>
                {sidebarOpen && <span>Community</span>}
              </Link>
              <Link to="/profile" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 ${location.pathname === '/profile' ? 'bg-primary text-white' : darkMode ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-person-circle"></i>
                {sidebarOpen && <span>Profile</span>}
              </Link>
              <Link to="/settings" className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded mb-2 ${location.pathname === '/settings' ? 'bg-primary text-white' : darkMode ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-gear"></i>
                {sidebarOpen && <span>Settings</span>}
              </Link>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-grow-1 d-flex flex-column">
          <div className="d-flex justify-content-end p-2 border-bottom">
            <span>Language: </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="form-select w-auto"
            >
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>

          {/* EDITOR */}
          {/* {!showExplanation && (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="form-control"
              style={{
                height: "100%",
                fontFamily: "monospace",
                fontSize: "14px",
                padding: "10px"
              }}
              placeholder="Write or paste your code"
            />
          )} */}

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="form-control"
            style={{
              height: "100%",
              fontFamily: "monospace",
              fontSize: "14px",
              padding: "10px"
            }}
            placeholder="Write or paste your code"
          />




          {/* BOTTOM */}
          <div className="p-2 border-top">
            {/* <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-control mb-2"
              placeholder="Input (optional)"
            /> */}

            <div className="d-flex gap-2 mb-2 flex-wrap">
              <button
                onClick={saveStats}
                className="btn btn-success"
              >
                <i className="bi bi-save me-1"></i>
                Save Code
              </button>

              <button
                onClick={() =>
                  navigate('/debug-explain', {
                    state: { code, language }
                  })
                }
                className="btn btn-primary"
              >
                Explain
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="btn btn-info text-white"
              >
                <i className="bi bi-share-fill me-1"></i> Share to Community
              </button>
            </div>

            {/* <pre className="bg-black text-success p-3 rounded"
              style={{ height: "150px", overflowY: "auto", whiteSpace: "pre-wrap" }}>
              {output || "Output will appear here"}
            </pre> */}

            {/*ADD HERE */}



            {/* {showExplanation && aiResult && (
              <div className="mt-3">

                <div className="card p-3 mb-2">
                  <h6>Explanation</h6>
                  <p>{aiResult.explanation}</p>
                </div>

                <div className="card p-3 mb-2">
                  <h6 className="text-danger">Errors</h6>
                  {aiResult.errors?.length > 0 ? (
                    <ul>
                      {aiResult.errors.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No errors</p>
                  )}
                </div>

                <div className="card p-3 mb-2">
                  <h6 className="text-success">Suggestions</h6>
                  {aiResult.suggestions?.length > 0 ? (
                    <ul>
                      {aiResult.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No suggestions</p>
                  )}
                </div>

                <div className="card p-3">
                  <h6 className="text-primary">Corrected Code</h6>
                  <pre style={{ background: "#000", color: "#00ff88", padding: "auto" }}>
                    {aiResult.fixed_code || "No corrected code"}
                  </pre>
                </div>

              </div>
            )} */}


          </div>
        </div>
      </div>

      {/* SHARE MODAL - Same as before */}
      {showShareModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Share Code to Community</h5>
                <button type="button" className="btn-close" onClick={() => setShowShareModal(false)}></button>
              </div>

              <div className="modal-body px-4">
                <div className="mb-3">
                  <label className="form-label fw-medium">Code Title <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g. Array Index Bug Fix" value={shareTitle} onChange={(e) => setShareTitle(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Description (optional)</label>
                  <textarea className="form-control" rows="3" placeholder="Brief description..." value={shareDescription} onChange={(e) => setShareDescription(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Language</label>
                  <select className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer border-0">
                <button className="btn btn-secondary px-4" onClick={() => setShowShareModal(false)}>Cancel</button>
                <button className="btn btn-primary px-4" onClick={shareToCommunity} disabled={sharing || !shareTitle.trim()}>
                  {sharing ? "Sharing..." : "Share Publicly"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}