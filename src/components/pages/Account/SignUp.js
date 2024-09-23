import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './StyleSig.css';
import { useTranslation } from 'react-i18next';

const SignUp = () => {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { t, i18n } = useTranslation();

  const getDirection = (lang) => {
    if (['ar', 'he', 'fa', 'ur'].includes(lang)) {
      return 'rtl';
    }
    return 'ltr';
  };

  const [direction, setDirection] = useState(getDirection(i18n.language));
  
  useEffect(() => {
    setDirection(getDirection(i18n.language));
  }, [i18n.language]);

  const handleName = (e) => {
    setClientName(e.target.value);
    setErrClientName("");
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  const emailValidation = (email) => {
    return String(email).match(/^\d{8,}$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://194.163.173.3:8888/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          name: clientName
        })
      });
      if (response.ok) {
        setSuccessMsg(t('signup.successMessage'));
        setClientName("");
        setEmail("");
        setPassword("");
        window.location.href = '/SigIn'; // Utilisez window.location.href pour rediriger vers /SignIn après inscription réussie
      } else {
        const errorData = await response.json();
        alert(`${t('signup.createAccount')} ${t('errors.shortPassword')}: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert(`${t('signup.createAccount')} ${t('errors.shortPassword')}: ${t('signup.errorMsg')}`);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (!clientName) {
      setErrClientName(t('errors.enterName'));
      isValid = false;
    }
    if (!email) {
      setErrEmail(t('errors.enterPhoneNumber'));
      isValid = false;

      
    } else if (!emailValidation(email)) {
      setErrEmail(t('errors.invalidPhoneNumber'));
      isValid = false;
    }
    if (!password) {
      setErrPassword(t('errors.createPassword'));
      isValid = false;
    } else if (password.length < 6) {
      setErrPassword(t('errors.shortPassword'));
      isValid = false;
    }

    if (isValid) {
      await handleSubmit(e);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100" dir={direction}>
      <div className="container">
        {successMsg ? (
          <div className="bg-white rounded-md shadow-md p-8">
            <p className="text-green-500 font-medium text-center mb-4">
              {successMsg}
            </p>
            <Link to="/SigIn">
              {t('signup.loginHere')}
            </Link>
          </div>
        ) : (
          <form className="bg-white rounded-md shadow-md p-8" onSubmit={handleSignUp}>
            <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-center">
              {t('signup.title')}
            </h1>
            <div className="mb-4">
              <label htmlFor="clientName" className="block text-gray-700 font-bold mb-2">{t('signup.fullName')}</label>
              <input
                id="clientName"
                onChange={handleName}
                value={clientName}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errClientName && "border-red-500"}`}
                type="text"
                placeholder={t('signup.placeholderName')}
              />
              {errClientName && (
                <p className="text-red-500 text-xs italic">{errClientName}</p>
              )}
            </div>
            <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-gray-700 font-bold mb-2">{t('signup.phoneNumber')}</label>

              <input
                id="email"
                onChange={handleEmail}
                value={email}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errEmail && "border-red-500"}`}
                type="tel"
                placeholder={t('signup.placeholderPhoneNumber')}
              />
              {errEmail && (
                <p className="text-red-500 text-xs italic">{errEmail}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-bold mb-2">{t('signup.password')}</label>
              <input
                id="password"
                onChange={handlePassword}
                value={password}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errPassword && "border-red-500"}`}
                type="password"
                placeholder={t('signup.placeholderPassword')}
              />
              {errPassword && (
                <p className="text-red-500 text-xs italic">{errPassword}</p>
              )}
            </div>
            <div className="mb-4">
              <input
                id="remember"
                onClick={() => setChecked(!checked)}
                className="mr-2 leading-tight"
                type="checkbox"
              />
              <label className="text-gray-700 text-sm" htmlFor="remember">
                {t('signup.termsAndConditions')}
              </label>
            </div>
            <button
  type="submit"
  className={`w-full bg-purple hover:bg-purple   py-2 px-4 rounded focus:outline-none focus:shadow-outline ${!checked && "cursor-not-allowed bg-gray-400 text-gray-200"}`}
  disabled={!checked}
>
  {t('signup.createAccount')}
</button>
            <p className="mt-4 text-center">
              {t('signup.alreadyHaveAccount')} <Link to="/SigIn" className="text-purple-700 hover:text-purple-900">{t('signup.loginHere')}</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
