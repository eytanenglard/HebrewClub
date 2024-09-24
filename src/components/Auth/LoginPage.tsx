import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/api";

interface LoginFormData {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
}

interface LoginPageProps {
  onClose: () => void;
  onRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onClose, onRegister }) => {
  const { t } = useTranslation();
  const { login, isLoggedIn, isChecking, loginError} = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    usernameOrEmail: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  useEffect(() => {
    if (!isChecking && isLoggedIn) {
      onClose();
      navigate("/");
    }
  }, [isChecking, isLoggedIn, onClose, navigate]);

  useEffect(() => {
    if (loginError) {
      setError(loginError);
    }
  }, [loginError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const loginSuccess = await login(
        formData.usernameOrEmail,
        formData.password,
        formData.rememberMe
      );

      if (loginSuccess) {
        onClose();
        navigate("/");
      } else {
        setError(loginError || t("login.loginError"));
      }
    } catch (error: any) {
      setError(error.message || t("login.loginError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await forgotPassword(forgotPasswordEmail);
      setSuccessMessage(t("login.passwordResetEmailSent"));
      setShowForgotPassword(false);
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setError(t("login.accountLocked"));
      } else {
        setError(t("login.passwordResetError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  if (isChecking) {
    return (
      <div className={styles.loadingContainer}>
        <p>{t("login.checkingAuth")}</p>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.loginContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.loginBox}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
      >
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.title}>{t("login.title")}</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}

        {!showForgotPassword ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="login-usernameOrEmail" className={styles.label}>
                <FaUser className={styles.inputIcon} />
                {t("login.usernameOrEmail")}
              </label>
              <input
                type="text"
                id="login-usernameOrEmail"
                name="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                className={styles.input}
                placeholder={t("login.usernameOrEmailPlaceholder")}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="login-password" className={styles.label}>
                <FaLock className={styles.inputIcon} />
                {t("login.password")}
              </label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  id="login-rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>
                  {t("login.rememberMe")}
                </span>
              </label>
            </div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? t("login.loggingIn") : t("login.loginButton")}
            </button>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className={styles.forgotPasswordButton}
            >
              {t("login.forgotPassword")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="forgotPasswordEmail" className={styles.label}>
                <FaEnvelope className={styles.inputIcon} />
                {t("login.email")}
              </label>
              <input
                type="email"
                id="forgotPasswordEmail"
                name="forgotPasswordEmail"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading
                ? t("login.sendingResetEmail")
                : t("login.sendResetEmail")}
            </button>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className={styles.cancelButton}
            >
              {t("login.cancel")}
            </button>
          </form>
        )}
        <div className={styles.registerPrompt}>
          <p>{t("login.noAccount")}</p>
          <button onClick={onRegister} className={styles.link}>
            {t("login.register")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
