import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ResetPassword.module.css";
import { resetPassword } from "../../services/auth";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaCheck,
  FaHome,
  FaInfoCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

interface ResetPasswordProps {
  token: string;
  onClose: () => void;
}

interface FormState {
  showPassword: boolean;
  showConfirmPassword: boolean;
  passwordStrength: string;
  resetSuccess: boolean;
  error: string | null;
  showPasswordRequirements: boolean;
  timeRemaining: number;
}

type FormAction =
  | { type: "TOGGLE_PASSWORD" }
  | { type: "TOGGLE_CONFIRM_PASSWORD" }
  | { type: "SET_PASSWORD_STRENGTH"; payload: string }
  | { type: "SET_RESET_SUCCESS" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "TOGGLE_PASSWORD_REQUIREMENTS" }
  | { type: "SET_TIME_REMAINING"; payload: number };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "TOGGLE_PASSWORD":
      return { ...state, showPassword: !state.showPassword };
    case "TOGGLE_CONFIRM_PASSWORD":
      return { ...state, showConfirmPassword: !state.showConfirmPassword };
    case "SET_PASSWORD_STRENGTH":
      return { ...state, passwordStrength: action.payload };
    case "SET_RESET_SUCCESS":
      return { ...state, resetSuccess: true, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "TOGGLE_PASSWORD_REQUIREMENTS":
      return {
        ...state,
        showPasswordRequirements: !state.showPasswordRequirements,
      };
    case "SET_TIME_REMAINING":
      return { ...state, timeRemaining: action.payload };
    default:
      return state;
  }
};

const initialState: FormState = {
  showPassword: false,
  showConfirmPassword: false,
  passwordStrength: "",
  resetSuccess: false,
  error: null,
  showPasswordRequirements: false,
  timeRemaining: 900, // 15 minutes in seconds
};

const usePasswordValidation = () => {
  return useCallback((password: string) => {
    const strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})"
    );
    const mediumRegex = new RegExp(
      "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})"
    );

    if (strongRegex.test(password)) {
      return "strong";
    } else if (mediumRegex.test(password)) {
      return "medium";
    } else {
      return "weak";
    }
  }, []);
};

const ResetPassword: React.FC<ResetPasswordProps> = React.memo(
  ({ token, onClose }) => {
    const { t } = useTranslation();
    const [state, dispatch] = useReducer(formReducer, initialState);
    const checkPasswordStrength = usePasswordValidation();

    useEffect(() => {
      document.body.classList.add(styles.modalOpen);
      return () => {
        document.body.classList.remove(styles.modalOpen);
      };
    }, []);

    useEffect(() => {
      const timer = setInterval(() => {
        dispatch({
          type: "SET_TIME_REMAINING",
          payload: state.timeRemaining - 1,
        });
      }, 1000);

      if (state.timeRemaining <= 0) {
        clearInterval(timer);
        dispatch({ type: "SET_ERROR", payload: t("auth.tokenExpired") });
      }

      return () => clearInterval(timer);
    }, [state.timeRemaining, t]);

    const handleSubmit = useCallback(
      async (values: { password: string; confirmPassword: string }) => {
        try {
          await resetPassword(token, values.password);
          dispatch({ type: "SET_RESET_SUCCESS" });
        } catch (error) {
          console.error("Password reset failed", error);
          dispatch({ type: "SET_ERROR", payload: t("auth.resetFailed") });
        }
      },
      [token, t]
    );

    const validationSchema = useMemo(
      () =>
        Yup.object({
          password: Yup.string()
            .min(8, t("auth.passwordTooShort"))
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              t("auth.passwordRequirements")
            )
            .required(t("auth.requiredField")),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], t("auth.passwordsMustMatch"))
            .required(t("auth.requiredField")),
        }),
      [t]
    );

    const modalVariants = {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    };

    const renderPasswordStrengthMeter = useMemo(
      () => (
        <>
          <div
            className={`${styles.passwordStrength} ${
              styles[state.passwordStrength]
            }`}
            aria-live="polite"
            aria-label={t(`auth.passwordStrength.${state.passwordStrength}`)}
          ></div>
          <div className={styles.passwordStrengthText}>
            {state.passwordStrength &&
              t(`auth.passwordStrength.${state.passwordStrength}`)}
          </div>
        </>
      ),
      [state.passwordStrength, t]
    );

    const renderPasswordRequirements = useMemo(
      () => (
        <motion.div
          className={styles.passwordRequirements}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: state.showPasswordRequirements ? "auto" : 0,
            opacity: state.showPasswordRequirements ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <ul>
            <li>{t("auth.passwordRequirement1")}</li>
            <li>{t("auth.passwordRequirement2")}</li>
            <li>{t("auth.passwordRequirement3")}</li>
            <li>{t("auth.passwordRequirement4")}</li>
          </ul>
        </motion.div>
      ),
      [state.showPasswordRequirements, t]
    );

    return (
      <AnimatePresence>
        <motion.div
          className={styles.modalOverlay}
          onClick={onClose}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <motion.div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label={t("auth.closeModal")}
            >
              &times;
            </button>
            <h2 className={styles.title}>{t("auth.resetPassword")}</h2>
            {state.resetSuccess ? (
              <motion.div
                className={styles.successMessage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p aria-live="polite">{t("auth.passwordResetSuccess")}</p>
                <Link to="/" className={styles.returnHomeButton}>
                  <FaHome className={styles.icon} />
                  {t("auth.returnHome")}
                </Link>
              </motion.div>
            ) : (
              <Formik
                initialValues={{ password: "", confirmPassword: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values, errors, touched, handleChange }) => (
                  <Form className={styles.form}>
                    <div className={styles.formGroup}>
                      <label htmlFor="password" className={styles.label}>
                        <FaLock className={styles.icon} />
                        {t("auth.newPassword")}
                      </label>
                      <div className={styles.passwordInputWrapper}>
                        <Field
                          type={state.showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          aria-required="true"
                          aria-describedby="passwordStrength passwordRequirements"
                          className={`${styles.input} ${
                            touched.password && errors.password
                              ? styles.inputError
                              : ""
                          }`}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const strength = checkPasswordStrength(
                              e.target.value
                            );
                            dispatch({
                              type: "SET_PASSWORD_STRENGTH",
                              payload: strength,
                            });
                            handleChange(e);
                          }}
                        />
                        <button
                          type="button"
                          className={styles.passwordToggle}
                          onClick={() => dispatch({ type: "TOGGLE_PASSWORD" })}
                          aria-label={
                            state.showPassword
                              ? t("auth.hidePassword")
                              : t("auth.showPassword")
                          }
                        >
                          {state.showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {touched.password && !errors.password && (
                          <FaCheck
                            className={`${styles.validIndicator} ${styles.show}`}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <ErrorMessage name="password">
                        {(msg) => (
                          <div className={styles.error} role="alert">
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                      {renderPasswordStrengthMeter}
                      <button
                        type="button"
                        className={styles.showRequirementsButton}
                        onClick={() =>
                          dispatch({ type: "TOGGLE_PASSWORD_REQUIREMENTS" })
                        }
                        aria-expanded={state.showPasswordRequirements}
                      >
                        <FaInfoCircle className={styles.icon} />
                        {t("auth.showPasswordRequirements")}
                      </button>
                      {renderPasswordRequirements}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="confirmPassword" className={styles.label}>
                        <FaLock className={styles.icon} />
                        {t("auth.confirmPassword")}
                      </label>
                      <div className={styles.passwordInputWrapper}>
                        <Field
                          type={state.showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          aria-required="true"
                          className={`${styles.input} ${
                            touched.confirmPassword && errors.confirmPassword
                              ? styles.inputError
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          className={styles.passwordToggle}
                          onClick={() =>
                            dispatch({ type: "TOGGLE_CONFIRM_PASSWORD" })
                          }
                          aria-label={
                            state.showConfirmPassword
                              ? t("auth.hidePassword")
                              : t("auth.showPassword")
                          }
                        >
                          {state.showConfirmPassword ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </button>
                        {touched.confirmPassword && !errors.confirmPassword && (
                          <FaCheck
                            className={`${styles.validIndicator} ${styles.show}`}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <ErrorMessage name="confirmPassword">
                        {(msg) => (
                          <div className={styles.error} role="alert">
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                    {state.error && (
                      <motion.div
                        className={styles.error}
                        role="alert"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {state.error}
                      </motion.div>
                    )}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || state.timeRemaining <= 0}
                      className={styles.submitButton}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isSubmitting ? (
                        <>
                          {t("auth.resetting")}
                          <span className={styles.loadingSpinner}></span>
                        </>
                      ) : (
                        t("auth.resetPassword")
                      )}
                    </motion.button>
                    <div
                      className={styles.tokenExpirationTimer}
                      aria-live="polite"
                    >
                      {t("auth.tokenExpiration", {
                        time: Math.floor(state.timeRemaining / 60),
                      })}
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }
);

export default ResetPassword;
