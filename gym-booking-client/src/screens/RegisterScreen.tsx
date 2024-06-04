import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./RegisterScreen.css";
import backgroundImage from "../assets/background-image.jpg";
import logo from "../assets/logo.jpg";
import CryptoJS from "crypto-js";

const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { username, email, password } = formData;

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string) => {
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return;
    }

    try {
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify({ username, email, password }),
        "your_secret_key"
      ).toString();

      const res = await axios.post("/api/users/register", {
        data: encryptedData,
      });
      login(res.data.token);
      navigate("/home");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="register-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <form className="register-form" onSubmit={onSubmit}>
        <img src={logo} alt="Logo" />
        <input
          type="text"
          name="username"
          value={username}
          onChange={onChange}
          placeholder="Username"
          required
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          required
        />
        <input type="submit" value="Register" />
        {error && <div className="error">{error}</div>}
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterScreen;
