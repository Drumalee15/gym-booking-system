import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./LoginScreen.css";
import backgroundImage from "../assets/background-image.jpg";
import logo from "../assets/logo.jpg";
import CryptoJS from "crypto-js";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string) => {
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

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
        JSON.stringify({ email, password }),
        "your_secret_key"
      ).toString();

      const res = await axios.post("/api/user/login", { data: encryptedData });
      login(res.data.token);
      navigate("/home");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <form className="login-form" onSubmit={onSubmit}>
        <img src={logo} alt="Logo" />
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input type="submit" value="Login" />
        {error && <div className="error">{error}</div>}
        <p>
          Not registered? <a href="/register">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default LoginScreen;
