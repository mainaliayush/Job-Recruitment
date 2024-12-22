import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../../css/signupPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const SignupForm = () => {
  const [role, setRole] = useState('applicant');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    company_name: '',
    company_phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();  // Initialize useNavigate

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/auth/signup', {
        ...formData,
        role,
      });

      console.log('Signup successful:', response.data);
      toast.success('Signup successful!');
      setTimeout(() => {
        navigate('/login');  
      }, 2000);  
    } catch (error) {
      if (error.response) {
        console.error('Signup failed:', error.response.data);
        toast.error('Signup failed. Please try again.');
      } else {
        console.error('Error:', error.message);
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-title">Signup</div>

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

        {role === 'applicant' && (
          <>
            <div className="form-group name-group">
              <div className="form-group-half">
                <label htmlFor="first_name" className="form-label">
                  First Name:
                </label>
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group-half">
                <label htmlFor="last_name" className="form-label">
                  Last Name:
                </label>
                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="phone_number" className="form-label">
                Phone Number:
              </label>
              <input
                id="phone_number"
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </>
        )}

        {role === 'employer' && (
          <>
            <div className="form-group">
              <label htmlFor="company_name" className="form-label">
                Company Name:
              </label>
              <input
                id="company_name"
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="company_phone" className="form-label">
                Company Phone:
              </label>
              <input
                id="company_phone"
                type="text"
                name="company_phone"
                value={formData.company_phone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
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
              name="password"
              value={formData.password}
              onChange={handleInputChange}
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

        <div className="switch-auth">
          <span className="switch-auth-text">
            Already have an account?{' '}
          </span>
          <a href="/login" className="switch-auth-link">
            Login
          </a>
        </div>

        <button type="submit" className="form-submit-btn">Sign Up</button>
      </form>
      <ToastContainer />  {/* Add this to render the toast notifications */}
    </div>
  );
};

export default SignupForm;
