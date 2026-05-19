import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// import { useTheme } from '../context/ThemeContext';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Signin() {
  const navigate = useNavigate();
  // const { darkMode } = useTheme();   // Get global theme

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password');
    }
    setLoading(false);
  };

  return (
    // <div className={`min-vh-100 d-flex align-items-center justify-content-center ${darkMode ? 'bg-dark' : 'bg-light'}`}>
    //   <div className={`card shadow ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white'}`} 
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow" style={{ width: "420px", borderRadius: "12px", overflow: "hidden" }}>
        
        {/* Blue Header*/}
        
        <div className="p-3 d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0 fw-bold text-white w-100 text-center">Sign in</h5>
          
        </div>

        <div className="card-body p-5">
          {/* <h4 className="text-center mb-4">Sign in</h4> */}

          {error && <div className="alert alert-danger text-center">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                // className={`form-control form-control-lg ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                className="form-control"
                placeholder="Enter your Email"
                style={{ fontSize: '0.95rem' }}   // Makes placeholder smaller
                required
              />
            </div>

           {/* Password Field */}
            <div className="mb-4">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Password"
                  required />
                <span
                  className="input-group-text"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </span>
              </div>
            </div>

            <div className="mb-4 text-first">
              <span className="small">Forgot password: </span>
              <Link to="/forgot-password" className="text-primary fw-bold text-decoration-none">
                click here
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-100 mb-4"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center">
            Don't have account?{' '}
            <Link to="/signup" className="text-primary fw-bold text-decoration-none">
              Sign up
            </Link>
          </div>
        </div>

        {/* <div className="card-footer text-center py-3 text-muted small">
          ©copyright , social media links
        </div>  */}
      </div>
    </div>
  );
}