import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import { useApi } from "../../../services/personalAreaapiService";
import {
  UserProfile,
  User,
  ApiResponse,
  EditableUserProfile,
  UserResponse,
} from "../../../admin/types/models";
import dayjs from "dayjs";
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaPencilAlt,
  FaSave,
  FaTrash,
  FaTimes,
  FaGlobe,
  FaMoon,
  FaSun,
  FaPhone,
  FaBirthdayCake,
  FaHome,
  FaCity,
  FaFlag,
  FaInfoCircle,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaLock,
} from "react-icons/fa";
import styles from "./Profile.module.css";
import axios from "axios";
import { forgotPassword } from "../../../services/api";
const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentUser, setCurrentUser, logout } = useAuth();
  const api = useApi();

  const [profile, setProfile] = useState<EditableUserProfile>({});
  const [editedProfile, setEditedProfile] = useState<EditableUserProfile>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const isRTL = i18n.language === "he";

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    }
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);
  }, [currentUser]);

  const adaptApiResponse = (response: any): User => {
    if (response.success && response.data && response.data.user) {
      return response.data.user;
    } else if (response._id) {
      return response;
    } else {
      throw new Error("Invalid API response structure");
    }
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await api.getUserProfile();
      const userData = adaptApiResponse(response);
      const profileData: EditableUserProfile = {
        _id: userData._id,
        name: userData.name || "",
        email: userData.email || "",
        username: userData.username || "",
        phone: userData.phone || "",
        dateOfBirth: userData.dateOfBirth
          ? dayjs(userData.dateOfBirth).format("YYYY-MM-DD")
          : undefined,
        address: userData.address || "",
        city: userData.city || "",
        country: userData.country || "",
        bio: userData.bio || "",
        role: userData.role?.name || "user",
        createdAt: userData.createdAt
          ? dayjs(userData.createdAt).format()
          : undefined,
        updatedAt: userData.updatedAt
          ? dayjs(userData.updatedAt).format()
          : undefined,
        twoFactorEnabled: userData.twoFactorEnabled || false,
        isEmailVerified: userData.isEmailVerified || false,
        status: userData.status || "active",
        failedLoginAttempts: userData.failedLoginAttempts || 0,
      };
      setProfile(profileData);
      setEditedProfile(profileData);
      setError("");
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      handleError(error, "profile.fetchError");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleServerResponse = (response: ApiResponse<UserResponse>): User => {
    const userData = response;
    const processedUser: User = {
      _id: userData._id,
      name: userData.name || "",
      email: userData.email || "",
      username: userData.username || "",
      phone: userData.phone || "",
      password: "",
      role: userData.role || { name: "user" },
      groups: userData.groups || [],
      courses: userData.courses || [],
      completedLessons: userData.completedLessons || [],
      progress: userData.progress || {},
      dateOfBirth: userData.dateOfBirth
        ? new Date(userData.dateOfBirth)
        : undefined,
      address: userData.address || "",
      city: userData.city || "",
      country: userData.country || "",
      bio: userData.bio || "",
      twoFactorEnabled: userData.twoFactorEnabled || false,
      isEmailVerified: userData.isEmailVerified || false,
      status: userData.status || "active",
      failedLoginAttempts: userData.failedLoginAttempts || 0,
      createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
      updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
      twoFactorSecret: userData.twoFactorSecret,
      resetPasswordToken: userData.resetPasswordToken,
      resetPasswordExpires: userData.resetPasswordExpires
        ? new Date(userData.resetPasswordExpires)
        : undefined,
      googleId: userData.googleId,
      facebookId: userData.facebookId,
      emailVerificationToken: userData.emailVerificationToken,
      jwtSecret: userData.jwtSecret,
      lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : undefined,
      lockUntil: userData.lockUntil ? new Date(userData.lockUntil) : undefined,
      avatar: userData.avatar,
    };
    return processedUser;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedProfile: Partial<UserProfile> = {
        name: editedProfile.name,
        email: editedProfile.email,
        username: editedProfile.username,
        phone: editedProfile.phone,
        dateOfBirth: editedProfile.dateOfBirth
          ? new Date(editedProfile.dateOfBirth)
          : undefined,
        address: editedProfile.address,
        city: editedProfile.city,
        country: editedProfile.country,
        bio: editedProfile.bio,
      };
      const response: ApiResponse<UserResponse> = await api.updateUserProfile(
        updatedProfile
      );
      const updatedUser = handleServerResponse(response);
      const updatedEditableProfile: EditableUserProfile = {
        ...updatedUser,
        dateOfBirth: updatedUser.dateOfBirth
          ? dayjs(updatedUser.dateOfBirth).format("YYYY-MM-DD")
          : undefined,
        role: updatedUser.role?.name || "user",
        createdAt: updatedUser.createdAt
          ? dayjs(updatedUser.createdAt).format()
          : undefined,
        updatedAt: updatedUser.updatedAt
          ? dayjs(updatedUser.updatedAt).format()
          : undefined,
      };
      setProfile(updatedEditableProfile);
      setEditedProfile(updatedEditableProfile);
      updateCurrentUser(updatedUser);
      setIsEditing(false);
      setError("");
      setSuccessMessage(t("profile.updateSuccess"));
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      handleError(error, "profile.updateError");
    } finally {
      setIsLoading(false);
    }
  };
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await forgotPassword(forgotPasswordEmail);
      if (response.success) {
        setSuccessMessage(t("profile.passwordResetEmailSent"));
        setShowForgotPassword(false);
      } else {
        setError(response.message || t("profile.passwordResetError"));
      }
    } catch (error) {
      handleError(error, "profile.passwordResetError");
    } finally {
      setIsLoading(false);
    }
  };
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t("profile.passwordMismatch"));
      return;
    }
    setIsLoading(true);
    try {
      await api.updateUserPassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setSuccessMessage(t("profile.passwordUpdateSuccess"));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      handleError(error, "profile.passwordUpdateError");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(t("profile.deleteConfirmation"))) {
      setIsLoading(true);
      try {
        await api.deleteUserAccount();
        logout();
      } catch (error) {
        handleError(error, "profile.deleteError");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateCurrentUser = (updatedProfile: User) => {
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        ...updatedProfile,
      };
      setCurrentUser(updatedUser);
    }
  };

  const handleError = (error: unknown, errorKey: string) => {
    console.error(`Error: ${errorKey}`, error);
    setError(t(errorKey));
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.log("Unauthorized error detected, logging out...");
      logout();
    }
  };

  const toggleEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing((prev) => !prev);
    setEditedProfile(profile);
    setError("");
    setSuccessMessage("");
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await forgotPassword(currentUser.email);
      if (response.success) {
        setSuccessMessage(t("profile.passwordResetEmailSent"));
        setShowResetPassword(false);
      } else {
        setError(response.message || t("profile.passwordResetError"));
      }
    } catch (error) {
      handleError(error, "profile.passwordResetError");
    } finally {
      setIsLoading(false);
    }
  };
  const renderFormField = (
    name: keyof EditableUserProfile,
    label: string,
    icon: React.ReactNode,
    type: string = "text"
  ) => (
    <div className={styles.formGroup}>
      <label htmlFor={name} className={styles.label}>
        {icon}
        {t(label)}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={editedProfile[name] != null ? String(editedProfile[name]) : ""}
        onChange={handleInputChange}
        disabled={!isEditing}
        className={styles.input}
      />
    </div>
  );

  const renderPasswordField = (
    name: keyof typeof passwordData,
    label: string,
    icon: React.ReactNode
  ) => (
    <div className={styles.formGroup}>
      <label htmlFor={name} className={styles.label}>
        {icon}
        {t(label)}
      </label>
      <div className={styles.passwordInputWrapper}>
        <input
          type={passwordVisibility[name] ? "text" : "password"}
          id={name}
          name={name}
          value={passwordData[name]}
          onChange={handlePasswordInputChange}
          className={styles.input}
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility(name)}
          className={styles.passwordToggle}
        >
          {passwordVisibility[name] ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`${styles.profileContainer} ${
        isDarkMode ? styles.darkMode : ""
      } ${isRTL ? styles.rtl : ""}`}
    >
      <div className={styles.profile}>
        <div className={styles.profileHeader}>
          <h1 className={styles.profileName}>{t("profile.title")}</h1>
          <div className={styles.settingsBar}>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleDarkMode}
              />
              <span className={styles.slider}></span>
            </label>
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              value={i18n.language}
              className={styles.languageSelect}
            >
              <option value="en">English</option>
              <option value="he">עברית</option>
            </select>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {successMessage && (
          <div className={styles.success}>{successMessage}</div>
        )}

        {isLoading ? (
          <div className={styles.loadingSpinner}></div>
        ) : (
          <>
            <h2 className={styles.sectionHeader}>
              {t("profile.personalInfo")}
            </h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              {renderFormField(
                "name",
                "profile.name",
                <FaUser className={styles.icon} />
              )}
              {renderFormField(
                "email",
                "profile.email",
                <FaEnvelope className={styles.icon} />,
                "email"
              )}
              {renderFormField(
                "username",
                "profile.username",
                <FaUserTag className={styles.icon} />
              )}
              {renderFormField(
                "phone",
                "profile.phone",
                <FaPhone className={styles.icon} />,
                "tel"
              )}
              {renderFormField(
                "dateOfBirth",
                "profile.dateOfBirth",
                <FaBirthdayCake className={styles.icon} />,
                "date"
              )}
              {renderFormField(
                "address",
                "profile.address",
                <FaHome className={styles.icon} />
              )}
              {renderFormField(
                "city",
                "profile.city",
                <FaCity className={styles.icon} />
              )}
              {renderFormField(
                "country",
                "profile.country",
                <FaFlag className={styles.icon} />
              )}

              <div className={styles.formGroup}>
                <label htmlFor="bio" className={styles.label}>
                  <FaInfoCircle className={styles.icon} />
                  {t("profile.bio")}
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={editedProfile.bio || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className={styles.input}
                />
              </div>
              <div className={styles.buttonGroup}>
                {isEditing ? (
                  <>
                    <button
                      type="submit"
                      className={`${styles.button} ${styles.primaryButton}`}
                      disabled={isLoading}
                    >
                      <FaSave className={styles.buttonIcon} />{" "}
                      {t("profile.save")}
                    </button>
                    <button
                      type="button"
                      onClick={toggleEditing}
                      className={`${styles.button} ${styles.secondaryButton}`}
                    >
                      <FaTimes className={styles.buttonIcon} />{" "}
                      {t("profile.cancel")}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={toggleEditing}
                    className={`${styles.button} ${styles.primaryButton}`}
                  >
                    <FaPencilAlt className={styles.buttonIcon} />{" "}
                    {t("profile.edit")}
                  </button>
                )}
              </div>
            </form>

            <h2 className={styles.sectionHeader}>
              {t("profile.changePassword")}
            </h2>
            {!showForgotPassword ? (
              <form onSubmit={handlePasswordChange} className={styles.form}>
                {renderPasswordField(
                  "currentPassword",
                  "profile.currentPassword",
                  <FaKey className={styles.icon} />
                )}
                {renderPasswordField(
                  "newPassword",
                  "profile.newPassword",
                  <FaKey className={styles.icon} />
                )}
                {renderPasswordField(
                  "confirmPassword",
                  "profile.confirmPassword",
                  <FaKey className={styles.icon} />
                )}
                <button
                  type="submit"
                  className={`${styles.button} ${styles.primaryButton}`}
                  disabled={isLoading}
                >
                  <FaKey className={styles.buttonIcon} />
                  {t("profile.changePassword")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className={`${styles.button} ${styles.secondaryButton}`}
                >
                  <FaLock className={styles.buttonIcon} />
                  {t("profile.forgotPassword")}
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="forgotPasswordEmail" className={styles.label}>
                    <FaEnvelope className={styles.icon} />
                    {t("profile.emailAddress")}
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
                  className={`${styles.button} ${styles.primaryButton}`}
                  disabled={isLoading}
                >
                  <FaLock className={styles.buttonIcon} />
                  {t("profile.resetPassword")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className={`${styles.button} ${styles.secondaryButton}`}
                >
                  <FaTimes className={styles.buttonIcon} />
                  {t("profile.cancel")}
                </button>
              </form>
            )}
            <h2 className={styles.sectionHeader}>{t("profile.security")}</h2>
            {!showResetPassword ? (
              <button
                onClick={() => setShowResetPassword(true)}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                {t("profile.resetPassword")}
              </button>
            ) : (
              <form onSubmit={handleResetPassword} className={styles.form}>
                <p>{t("profile.resetPasswordConfirmation")}</p>
                <button
                  type="submit"
                  className={`${styles.button} ${styles.primaryButton}`}
                  disabled={isLoading}
                >
                  {isLoading
                    ? t("profile.sendingResetEmail")
                    : t("profile.sendResetEmail")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetPassword(false)}
                  className={`${styles.button} ${styles.secondaryButton}`}
                >
                  {t("profile.cancel")}
                </button>
              </form>
            )}
            <h2 className={styles.sectionHeader}>{t("profile.dangerZone")}</h2>
            <div className={styles.buttonGroup}>
              <button
                onClick={handleDeleteAccount}
                className={`${styles.button} ${styles.secondaryButton}`}
                disabled={isLoading}
              >
                <FaTrash className={styles.buttonIcon} />{" "}
                {t("profile.deleteAccount")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
