import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { saveToken, saveUser } from "./userStorageService";
import { useTranslation } from 'react-i18next';
import './style.css'; // Assurez-vous que le fichier CSS est correctement lié

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || "";
  const { t, i18n } = useTranslation();

  // Function to determine text direction based on language
  const getDirection = (lang) => {
    if (['ar', 'he', 'fa', 'ur'].includes(lang)) {
      return 'rtl';
    }
    return 'ltr';
  };

  // Update direction when language changes
  const [direction, setDirection] = useState(getDirection(i18n.language));
  
  useEffect(() => {
    setDirection(getDirection(i18n.language));
  }, [i18n.language]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://194.163.173.3:8888/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const token = response.headers.get("authorization")?.substring(7);
        const user = await response.json();
        if (token && user) {
          saveToken(token);
          saveUser(user);
          if (user.role === "ADMIN") {
            navigate("/admin/DashboardCards");
            window.location.reload();
          } else {
            navigate("/products");
            window.location.reload();
          }
        }
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="login-container" dir={direction}>
      {message && <p className="alert alert-warning">{t('login.alert_warning')}: {t('login_redirect_message')}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <h2>{t('login.title')}</h2>
        <div className="form-group">
          <label>{t('login.number')}</label>
          <input
            type="tel"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t('login.phonenumber')}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>{t('login.password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('login.enter_password')}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ fontFamily: "'Open Sans Condensed', sans-serif", fontSize: '1.2rem', height: '50px'," backgroundColor": "rgb(67, 0, 86)" }}>
          {t('login.login_button')}
        </button>
        <div className="mt-3">
          <span>{t('login.no_account')} </span>
          <Link to="/SignUp" className="btn-link">{t('login.register_here')}</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
