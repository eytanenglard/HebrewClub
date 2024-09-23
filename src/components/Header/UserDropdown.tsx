// UserDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaUser,
  FaCog,
  FaBook,
  FaEnvelope,
  FaSignOutAlt,
  FaGraduationCap,
} from "react-icons/fa";
import styles from "./UserDropdown.module.css";
import { useAuth } from "../../context/AuthContext";

const UserDropdown: React.FC = () => {
  const { t } = useTranslation();
  const { isLoggedIn, currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  if (!isLoggedIn || !currentUser) {
    return (
      <div className={styles.dropdown} ref={dropdownRef}>
        <button onClick={toggleDropdown} className={styles.dropdownToggle}>
          <FaUser />
        </button>
        {isOpen && (
          <div className={styles.dropdownMenu}>
            <Link to="/login" className={styles.dropdownItem}>
              {t("auth.login")}
            </Link>
            <Link to="/register" className={styles.dropdownItem}>
              {t("auth.register")}
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button onClick={toggleDropdown} className={styles.dropdownToggle}>
        <div className={styles.userAvatar}>
          {currentUser.name ? currentUser.name[0].toUpperCase() : "?"}
        </div>
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <Link to="/personal-area" className={styles.dropdownItem}>
            <FaUser /> {t("userDropdown.personalArea")}
          </Link>
          <Link to="/account-settings" className={styles.dropdownItem}>
            <FaCog /> {t("userDropdown.accountSettings")}
          </Link>
          <Link to="/course-management" className={styles.dropdownItem}>
            <FaGraduationCap /> {t("userDropdown.courseManagement")}
          </Link>
          <Link to="/my-courses" className={styles.dropdownItem}>
            <FaBook /> {t("userDropdown.myCourses")}
          </Link>
          <Link to="/contact" className={styles.dropdownItem}>
            <FaEnvelope /> {t("userDropdown.contact")}
          </Link>
          <button onClick={handleLogout} className={styles.dropdownItem}>
            <FaSignOutAlt /> {t("userDropdown.logout")}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
