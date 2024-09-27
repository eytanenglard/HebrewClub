import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { verifyEmail, resendVerificationEmail } from "../../services/auth";
import { EmailVerificationRequest } from "../../admin/types/models";
import { useAuth } from "../../context/AuthContext";
import styles from "./VerifyEmail.module.css";
import { FaCheck, FaMoon, FaSun } from "react-icons/fa";

const VerifyEmail: React.FC = () => {
  const [token, setToken] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<"token" | "code">("token");

  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    console.log("VerifyEmail component mounted");
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get("token");
    const emailFromUrl = searchParams.get("email");
    console.log("Token from URL:", tokenFromUrl);
    console.log("Email from URL:", emailFromUrl);
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setVerificationMethod("token");
    }
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    }
    if (tokenFromUrl && emailFromUrl) {
      handleVerify(tokenFromUrl, decodeURIComponent(emailFromUrl));
    }

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, [location]);

  useEffect(() => {
    if (isLoggedIn) {
      console.log("User is already logged in, redirecting to home");
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        navigate("/");
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [success, navigate]);

  const handleVerify = async (verificationToken?: string, userEmail?: string) => {
    console.log("Starting verification process");
    setIsLoading(true);
    setError("");
    try {
      let verificationData: EmailVerificationRequest = { email: userEmail || email };
      if (verificationMethod === "token") {
        verificationData.token = verificationToken || token;
      } else {
        verificationData.code = code;
      }
      console.log("Verification data:", verificationData);
      const response = await verifyEmail(verificationData);
      console.log("Verification response:", response);
      if (response.success) {
        setSuccess(true);
      } else {
        setError(t("verifyEmail.verificationFailed"));
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(t("verifyEmail.verificationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    console.log("Resending verification email");
    setIsLoading(true);
    setError("");
    try {
      const response = await resendVerificationEmail(email);
      console.log("Resend verification response:", response);
      if (response.success) {
        setError("");
        alert(t("verifyEmail.resendSuccess"));
      } else {
        setError(t("verifyEmail.resendFailed"));
      }
    } catch (err) {
      console.error("Resend verification error:", err);
      setError(t("verifyEmail.resendFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  if (success) {
    return (
      <div className={`${styles.pageContainer} ${darkMode ? styles.darkMode : ""}`}>
        <div className={styles.verifyEmailContainer}>
          <div className={styles.successMessage}>
            <FaCheck className={styles.icon} />
            {t("verifyEmail.successMessage")}
            <p>{t("verifyEmail.redirecting", { countdown })}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.pageContainer} ${darkMode ? styles.darkMode : ""}`}>
      <button onClick={toggleDarkMode} className={styles.darkModeToggle}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
      <div className={styles.verifyEmailContainer}>
        <h2>{t("verifyEmail.title")}</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}>
          <div className={styles.inputGroup}>
            <label>
              <input
                type="radio"
                value="token"
                checked={verificationMethod === "token"}
                onChange={() => setVerificationMethod("token")}
              />
              {t("verifyEmail.useToken")}
            </label>
            <label>
              <input
                type="radio"
                value="code"
                checked={verificationMethod === "code"}
                onChange={() => setVerificationMethod("code")}
              />
              {t("verifyEmail.useCode")}
            </label>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("verifyEmail.emailPlaceholder")}
            className={styles.input}
            required
          />
          {verificationMethod === "token" ? (
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={t("verifyEmail.tokenPlaceholder")}
              className={styles.input}
              required
            />
          ) : (
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("verifyEmail.codePlaceholder")}
              className={styles.input}
              required
            />
          )}
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? t("verifyEmail.verifying") : t("verifyEmail.verify")}
          </button>
        </form>
        <button
          onClick={handleResendVerification}
          className={styles.resendButton}
          disabled={isLoading || !email}
        >
          {t("verifyEmail.resend")}
        </button>
        <div className={styles.backToHomepage}>
          <Link to="/">{t("verifyEmail.backToHomepage")}</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;