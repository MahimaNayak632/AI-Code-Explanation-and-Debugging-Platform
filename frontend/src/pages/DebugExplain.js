
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function DebugExplain() {

  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const code = location.state?.code || '';
  const language = location.state?.language || 'java';

  const [aiResult, setAiResult] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // ================= AI ANALYZE =================
  const analyzeCode = async () => {

    if (!code) return;

    setLoadingAI(true);
    setAiResult(null);

    try {

      const res = await axios.post(
        `${API_URL}/api/code/analyze`,
        {
          code,
          language
        }
      );

      console.log("API RESPONSE:", res.data);

      // FORMAT CODE PROPERLY
    if (res.data.fixed_code) {

  let formattedCode = res.data.fixed_code;

  // Convert escaped newlines/tabs
  formattedCode = formattedCode.replace(/\\n/g, '\n');
  formattedCode = formattedCode.replace(/\\t/g, '    ');
  formattedCode = formattedCode.replace(/\\"/g, '"');

  // Remove extra single-line compression
  formattedCode = formattedCode.trim();
  
  res.data.fixed_code = formattedCode;
}

      setAiResult(res.data);

    } catch (err) {

      console.error(err);

      alert("AI failed");
    }

    setLoadingAI(false);
  };

  // ================= AUTO RUN =================
  useEffect(() => {

    if (code) {
      analyzeCode();
    }

  }, [code]);

  return (

    <div
      className={`min-vh-100 d-flex flex-column ${darkMode
        ? 'bg-dark text-light'
        : 'bg-light text-dark'
        }`}
    >

      {/* NAVBAR */}
      <nav
        className={`navbar px-4 ${darkMode
          ? 'bg-dark border-bottom border-secondary text-light'
          : 'bg-light border-bottom'
          }`}
      >

        <button
          className="btn btn-outline-primary"
          onClick={() =>
            navigate('/editor', {
              state: { code, language }
            })
          }
        >
          ← Back to Editor
        </button>

        <h5 className="mb-0 fw-bold">
          Debug & Explain
        </h5>

      </nav>

      {/* BODY */}
      <div className="d-flex flex-grow-1">

        {/* LEFT SIDE - ORIGINAL CODE */}
        <div
          style={{
            width: "50%",
            borderRight: "1px solid gray"
          }}
        >

          <div
            style={{
              padding: "10px",
              height: "100%"
            }}
          >

            <Editor
              height="100%"
              language={language}
              value={code}
              theme={darkMode ? "vs-dark" : "light"}
              options={{
                readOnly: true,
                minimap: {
                  enabled: false
                },
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />

          </div>
        </div>

        {/* RIGHT SIDE - AI RESULT */}
        <div
          style={{
            width: "50%"
          }}
          className="p-3 d-flex flex-column"
        >

          {/* HEADER */}
          <h5 className="fw-bold mb-3">
            AI Analysis
          </h5>

          {/* BUTTON */}
          <div className="d-flex gap-2 mb-3">

            <button
              onClick={analyzeCode}
              className="btn btn-primary"
            >
              {loadingAI
                ? "Analyzing..."
                : "Explain"}
            </button>

          </div>

          {/* RESULT AREA */}
          <div
            style={{
              overflowY: "auto",
              flexGrow: 1
            }}
          >

            {aiResult && (
              <>

                {/* LANGUAGE */}
                <div className="card p-3 mb-3">

                  <h6 className="text-primary">
                    Language
                  </h6>

                  <p className="mb-0">
                    {aiResult.language || language}
                  </p>

                </div>

                {/* EXPLANATION */}
                <div className="card p-3 mb-3">

                  <h6>
                    Explanation
                  </h6>

                  {Array.isArray(aiResult.explanation) ? (
                    <ol>
                      {aiResult.explanation.map((item, i) => (
                        <li key={i}>
                          {item}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p>
                      {aiResult.explanation}
                    </p>
                  )}

                </div>

                {/* ERRORS */}
                <div className="card p-3 mb-3">

                  <h6 className="text-danger">
                    Errors
                  </h6>

                  {aiResult.errors?.length > 0 ? (

                    <ul>
                      {aiResult.errors.map((e, i) => (
                        <li key={i}>
                          {e}
                        </li>
                      ))}
                    </ul>

                  ) : (

                    <p>
                      No errors found
                    </p>

                  )}

                </div>

                {/* SUGGESTIONS */}
                <div className="card p-3 mb-3">

                  <h6 className="text-success">
                    Suggestions
                  </h6>

                  {aiResult.suggestions?.length > 0 ? (

                    <ul>
                      {aiResult.suggestions.map((s, i) => (
                        <li key={i}>
                          {s}
                        </li>
                      ))}
                    </ul>

                  ) : (

                    <p>
                      No suggestions
                    </p>

                  )}

                </div>

                {/* CORRECTED CODE */}
                <div className="card p-3 mb-3">

                  <h6 className="text-primary">
                    Corrected Code
                  </h6>

                  <pre
                    style={{
                      background: "#000",
                      color: "#00ff88",
                      padding: "15px",
                      borderRadius: "10px",
                      overflowX: "auto",
                      fontSize: "14px",
                      lineHeight: "1.7",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      fontFamily: "Consolas, monospace"
                    }}
                  >
                    {aiResult.fixed_code || "No corrected code"}
                  </pre>

                </div>

              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}