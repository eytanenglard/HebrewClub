import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaInfoCircle,
  FaBlog,
  FaEnvelope,
  FaGlobe,
  FaCog,
  FaChartBar,
  FaUserShield,
} from "react-icons/fa";
import styles from "./Header.module.css";
import { useAuth } from "../../context/AuthContext";
import UserDropdown from "./UserDropdown";

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick }) => {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, currentUser, isChecking } = useAuth();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { to: "/", label: "header.home", icon: <FaHome /> },
    { to: "/courses", label: "header.courses", icon: <FaBook /> },
    { to: "/about", label: "header.about", icon: <FaInfoCircle /> },
    { to: "/blog", label: "header.blog", icon: <FaBlog /> },
    { to: "/contact", label: "header.contact", icon: <FaEnvelope /> },
  ];

  // Add dashboard link based on user's login status and role
  if (isLoggedIn && currentUser) {
    if (currentUser.role?.name === "admin") {
      // Admin user: Special admin dashboard + admin dashboard link
      navLinks.push({
        to: "/admin-dashboard",
        label: "header.adminDashboard",
        icon: <FaUserShield />,
      });
      navLinks.push({
        to: "/admin",
        label: "header.adminPanel",
        icon: <FaCog />,
      });
    } else {
      // Regular logged-in user: Special user dashboard
      navLinks.push({
        to: "/user-dashboard",
        label: "header.userDashboard",
        icon: <FaChartBar />,
      });
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <img src="/assets/images/logo3.svg" alt="The Hebrew Club" />
          </Link>
        </div>

        <nav className={styles.nav}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>
                  {link.icon}
                  <span>{t(link.label)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {isChecking ? (
            <div className={styles.loading}>Loading...</div>
          ) : isLoggedIn && currentUser ? (
            <UserDropdown />
          ) : (
            <>
              <button onClick={onLoginClick} className={styles.loginButton}>
                {t("header.login")}
              </button>
              <button
                onClick={onRegisterClick}
                className={styles.registerButton}
              >
                {t("header.register")}
              </button>
            </>
          )}
          <div className={styles.languageSwitch}>
            <button
              onClick={() => changeLanguage("he")}
              className={i18n.language === "he" ? styles.active : ""}
            >
              עב
            </button>
            <FaGlobe className={styles.languageIcon} />
            <button
              onClick={() => changeLanguage("en")}
              className={i18n.language === "en" ? styles.active : ""}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
