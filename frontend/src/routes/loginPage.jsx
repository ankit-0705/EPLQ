import React, { useState, useEffect, useContext } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MacroContext from '../context/locationContext';
const backendUrl = import.meta.env.VITE_API_BASE_URL;


function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });

  const navigate = useNavigate();
  const { infoGetter } = useContext(MacroContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/user/login`, formData);
      localStorage.setItem('auth-token',res.data.jwtToken);
      setTimeout(async ()=> {
        await infoGetter();
        navigate('/home');
      },100);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/');
  }


  return (
    <div className="hero bg-base-200 min-h-screen p-5">
      <div className="hero-content flex-col lg:flex-col gap-9">
        <div className="text-center lg:text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-success drop-shadow-[0_0_10px_rgba(34,197,94,0.7)] leading-tight">
            <span className="inline-block h-[2.8rem] sm:h-[3.2rem] overflow-hidden">
              <Typewriter
                words={['Welcome Back!']}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={100}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>
          </h1>
          <p className="py-6">Log in to continue where you left off — your personalized macro experience awaits!</p>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="fieldset gap-4 flex flex-col">

              {/* Email or Phone Input */}
              <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                    <path d="M16 2a2 2 0 0 1 2 2v1H6V4a2 2 0 0 1 2-2h8zM4 7h16v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
                  </g>
                </svg>
                <input
                  type="text"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  required
                  placeholder="Email or Phone"
                  pattern="^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[0-9]{10})$"
                  title="Enter a valid email or 10-digit phone number"
                />
              </label>

              {/* Password Input */}
              <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </g>
                </svg>
                <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}"
                title="Password must be at least 8 characters, with uppercase, lowercase, number, and symbol"
              />
              </label>
              <button type="submit" className="btn btn-soft btn-default mt-2">Submit</button>
            </form>
              <button className="btn btn-soft btn-default mt-1" onClick={handleRegister}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
