import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
//import { useTheme } from '../context/ThemeContext';
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
export default function Signup() {
  const navigate = useNavigate();
  // const { darkMode } = useTheme();   // Get global theme



  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }


    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      alert("Account created successfully! Please login.");
      navigate('/signin');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    }

    setLoading(false);
  };

  return (
    // <div className={`min-vh-100 d-flex align-items-center justify-content-center ${darkMode ? 'bg-dark' : 'bg-light'}`}>
    //   <div className={`card shadow ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white'}`} 
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow" style={{ width: "420px", borderRadius: "12px", overflow: "hidden" }}>

        {/* Blue  Header */}
        {/*<div className={`p-3 d-flex justify-content-between align-items-center ${darkMode ? 'bg-primary' : 'bg-primary'}`}>*/}
        <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-white w-100 text-center">Sign up</h5>
          {/* <Link to="/" className="text-white text-decoration-none small">
            ← Back to home
          </Link> */}
        </div>


        {/* <hr className="mx-4" /> */}

        {/* Form Area */}
        <div className="card-body px-5 py-4">
          <form onSubmit={handleSubmit}>

            <div className="mb-4">
              <label className="form-label">User Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                // className={`form-control form-control-lg ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                className="form-control"
                placeholder="Enter your Full name"
                //  style={{ fontSize: '1rem' }}   // Makes placeholder smaller
                required
              />
            </div>

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
                //  style={{ fontSize: '1rem' }}   // Makes placeholder smaller
                required
              />
            </div>

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

            <div className="mb-4">
              <label className="form-label">Confirm password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Confirm Password"
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

            {error && (
              <div className="alert alert-danger py-2 text-center mb-3">{error}</div>
            )}

            <div className="d-grid mb-3">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-100 mb-4"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>

            <div className="text-center">
              Already have account?{' '}
              <Link to="/signin" className="text-primary fw-bold text-decoration-none">
                sign in
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        {/* <div className="card-footer text-center py-3 bg-light text-muted small">
          copyright, social media links
        </div> */}
      </div>
    </div>
  );
}