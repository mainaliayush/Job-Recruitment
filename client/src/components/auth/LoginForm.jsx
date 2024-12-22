import React, { useState } from 'react';
import useLogin from "../../hooks/useLogin";  
import { toast, ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  
import '../../css/loginPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
  const [role, setRole] = useState('applicant');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await(login(username, password, role))
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-title">Login</div>

        <div className="form-group">
          <div className="role-toggle">
            <button
              type="button"
              className={`toggle-button-applicant ${role === 'applicant' ? 'active' : ''}`}
              onClick={() => setRole('applicant')}
            >
              Applicant
            </button>
            <button
              type="button"
              className={`toggle-button-employer ${role === 'employer' ? 'active' : ''}`}
              onClick={() => setRole('employer')}
            >
              Employer
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye/> : <FaEyeSlash/>}
            </span>
          </div>
        </div>

        <div className="auth-link">
          <a href="#" className="auth-link">
            Forgot Password?
          </a>
        </div>

        <div className="switch-auth">
          <span className="switch-auth-text">
            Don't have an account?{' '}
          </span>
          <a href="/signup" className="switch-auth-link">
            Signup
          </a>
        </div>

        <button type="submit" className="form-submit-btn" disabled={loading}>
          {loading ? <span className='loading loading-spinner '>...</span> : "Login"}
        </button>
      </form>
      <ToastContainer /> 
    </div>
  );
};

export default LoginForm;
