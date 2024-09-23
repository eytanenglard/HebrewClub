import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaCheckCircle,
} from "react-icons/fa";
import styles from "./RegisterPage.module.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface RegisterPageProps {
  onClose: () => void;
  onLoginClick: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
  onClose,
  onLoginClick,
}) => {
  const { t } = useTranslation();
  const { register, isLoggedIn, loginError, isChecking } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);

  useEffect(() => {
    if (isLoggedIn) {
      setRegistrationSuccess(true);
      setTimeout(() => {
        onClose();
        navigate("/verify-email");
      }, 3000);
    }
  }, [isLoggedIn, onClose, navigate]);

  useEffect(() => {
    if (loginError) {
      setError(loginError);
    }
  }, [loginError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      if (response.success) {
        navigate("/verify-email", { state: { email: formData.email } });
        setRegistrationSuccess(true);
        setTimeout(() => {
          onClose();
          navigate("/verify-email", {
            state: {
              email: formData.email,
              message:
                "Please check your email for verification instructions. You can verify your email using either the link or the code provided.",
            },
          });
        }, 3000);
      } else {
        setError(response.error || t("auth.registrationError"));
      }
    } catch (error: any) {
      setError(error.message || t("auth.registrationError"));
    }
  };

  const handleSocialRegister = (provider: string) => {
    // Implement social registration logic here
    console.log(`Social registration with ${provider}`);
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  if (registrationSuccess) {
    return (
      <motion.div
        className={styles.registerContainer}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
      >
        <div className={styles.registerBox}>
          <FaCheckCircle className={styles.successIcon} />
          <h2 className={styles.title}>{t("auth.registrationSuccess")}</h2>
          <p>{t("auth.redirecting")}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.registerContainer}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
    >
      <div className={styles.registerBox}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.title}>{t("auth.register")}</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="register-name" className={styles.label}>
              <FaUser className={styles.inputIcon} />
              {t("auth.name")}
            </label>
            <input
              type="text"
              id="register-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="register-email" className={styles.label}>
              <FaEnvelope className={styles.inputIcon} />
              {t("auth.email")}
            </label>
            <input
              type="email"
              id="register-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="register-username" className={styles.label}>
              <FaUser className={styles.inputIcon} />
              {t("auth.username")}
            </label>
            <input
              type="text"
              id="register-username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="register-password" className={styles.label}>
              <FaLock className={styles.inputIcon} />
              {t("auth.password")}
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="register-password"
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
          <div className={styles.formGroup}>
            <label htmlFor="register-confirmPassword" className={styles.label}>
              <FaLock className={styles.inputIcon} />
              {t("auth.confirmPassword")}
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="register-confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isChecking}
          >
            {isChecking ? t("auth.registering") : t("auth.register")}
          </button>
        </form>
        <div className={styles.divider}>
          <span>{t("auth.orRegisterWith")}</span>
        </div>
        <div className={styles.socialButtons}>
          <button
            onClick={() => handleSocialRegister("google")}
            className={`${styles.socialButton} ${styles.googleButton}`}
          >
            <FaGoogle /> Google
          </button>
          <button
            onClick={() => handleSocialRegister("facebook")}
            className={`${styles.socialButton} ${styles.facebookButton}`}
          >
            <FaFacebook /> Facebook
          </button>
        </div>
        <div className={styles.loginPrompt}>
          <p>{t("auth.alreadyHaveAccount")}</p>
          <button onClick={onLoginClick} className={styles.link}>
            {t("auth.login")}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
