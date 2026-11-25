import { API_BASE_URL } from "../api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
       `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Registration successful!");

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.log(error);

      alert("Server connection failed");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-logo logo">
          <img
            src="/images/logo.png"
            alt="FunPlay Logo"
          />
        </div>

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Join FunPlay and start learning!
        </p>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>


          {/* Email */}
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>


          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>


          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>


          {/* Submit */}
          <button
            type="submit"
            className="register-submit"
          >
            Create Account
          </button>

        </form>


        <p className="login-text">
          Already have an account?

          <Link to="/login">
            {" "}Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;