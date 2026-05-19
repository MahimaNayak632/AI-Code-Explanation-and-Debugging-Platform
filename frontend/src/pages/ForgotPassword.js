import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Step management: 1 = Enter Email, 2 = Enter OTP and New Password
  const [step, setStep] = useState(1);

  // Form fields
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI feedback states
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ==================== STEP 1: Send OTP ====================
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Call backend to send OTP to user's email
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      
      setMessage('OTP has been sent to your email successfully!');
      setStep(2); // Move to next step
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    }
    setLoading(false);
  };

  // ==================== STEP 2: Reset Password ====================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("New Password and Confirm Password do not match");
      setLoading(false);
      return;
    }

    try {
      // Call backend to reset password using OTP
      await axios.post(`${API_URL}/api/reset/reset-password`, {
      token: otp,
      password: newPassword
      });

      setMessage('Password reset successful! Redirecting to login...');
      
      // Redirect to signin page after 2.5 seconds
      setTimeout(() => navigate('/signin'), 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ width: "480px", borderRadius: "12px", overflow: "hidden" }}>
        
        {/* Blue Header - Matches your design */}
        <div className="bg-primary text-white p-4 text-center">
          <h4 className="mb-0 fw-bold">Password Reset</h4>
        </div>

        <div className="card-body p-5">
          
          {/* Success Message */}
          {message && <div className="alert alert-success text-center">{message}</div>}
          
          {/* Error Message */}
          {error && <div className="alert alert-danger text-center">{error}</div>}

          {/* ==================== STEP 1: Enter Email ==================== */}
          {step === 1 && (
            <form onSubmit={handleSendOTP}>
              <div className="mb-4">
                
                <label className="form-label fw-medium">Forgot your password? Enter your email addres.</label>
             
                
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Email address"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-100"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* ==================== STEP 2: Enter OTP and New Password ==================== */}
          {step === 2 && (
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label className="form-label fw-medium">Enter OTP:</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Enter OTP sent to your email"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Confirm New Password:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-100"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          )}

          {/* Back to Sign In Link */}
          <div className="text-center mt-4">
            <Link to="/signin" className="text-primary fw-bold text-decoration-none">
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="card-footer text-center py-3 text-muted small">
          ©copyright , social media links
        </div> */}
      </div>
    </div>
  );
}