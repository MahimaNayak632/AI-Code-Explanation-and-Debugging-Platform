import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ProfileProvider } from "./context/ProfileContext";

import Landing from './pages/Landing';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
// import Submissions from './pages/Submissions';
import DebugExplain from './pages/DebugExplain';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Settings from './pages/Settings';
import SavedCodes from "./pages/SavedCodes";

function App() {
  const BYPASS_LOGIN = true;

  const isAuthenticated = BYPASS_LOGIN || !!localStorage.getItem('token');

  return (
    <Router>
      <ThemeProvider>
        <ProfileProvider>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />}
            />
            <Route
              path="/editor"
              element={isAuthenticated ? <Editor /> : <Navigate to="/signin" />}
            />
            <Route path="/debug-explain"
              element={isAuthenticated ? <DebugExplain /> : <Navigate to="/signin" />} />
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <Navigate to="/signin" />}
            />
            <Route
              path="/community"
              element={isAuthenticated ? <Community /> : <Navigate to="/signin" />}
            />
            <Route path='/settings' element={isAuthenticated ? <Settings /> : <Navigate to="/sighin" />} />

            <Route
  path="/saved-codes"
  element={isAuthenticated ? <SavedCodes /> : <Navigate to="/signin" />}
/>

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/" />} />


          </Routes>
        </ProfileProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;