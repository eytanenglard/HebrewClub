import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaBell,
  FaHome,
  FaBook,
  FaTasks,
  FaGraduationCap,
  FaCalendar,
  FaComments,
  FaCog,
  FaChevronUp,
  FaPlus,
  FaBars,
} from "react-icons/fa";
import styles from "./PersonalArea.module.css";
import { useAuth } from "../../context/AuthContext";
import Dashboard from "./Dashboard/Dashboard";
import Settings from "./Settings/Settings";
import Profile from "./Profile/Profile";

const PersonalArea: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();
  const { isLoggedIn, isChecking, logout, checkAuthStatus } = useAuth();

  useEffect(() => {
    const initializePersonalArea = async () => {
      if (!isChecking && !isLoggedIn) {
        await checkAuthStatus();
      }
    };

    initializePersonalArea();
  }, [isChecking, isLoggedIn, checkAuthStatus]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter((x) => x);
    let breadcrumbs = [{ name: "Home", path: "/" }];
    let currentPath = "";

    paths.forEach((path) => {
      currentPath += `/${path}`;
      breadcrumbs.push({
        name: path.charAt(0).toUpperCase() + path.slice(1),
        path: currentPath,
      });
    });

    return breadcrumbs;
  };

  if (isChecking) {
    return <div className={styles.loadingSpinner}></div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.personalArea}>
      <header className={styles.header}>
        <div className={styles.logo}>HebrewClub</div>
        <div className={styles.headerActions}>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
            />
          </div>
          <div className={styles.notificationIcon}>
            <FaBell />
            <span className={styles.notificationBadge}>3</span>
          </div>
          <div className={styles.userProfile}>
            <img
              src={"/path/to/default-avatar.jpg"}
              alt="User Avatar"
              className={styles.userAvatar}
            />
            <div className={styles.userProfileDropdown}>
              <Link to="/personal-area/profile" className={styles.dropdownItem}>
                Profile
              </Link>
              <Link
                to="/personal-area/settings"
                className={styles.dropdownItem}
              >
                Settings
              </Link>
              <button onClick={logout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        <nav className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
          <Link
            to="/personal-area/dashboard"
            className={`${styles.sidebarItem} ${
              location.pathname === "/personal-area/dashboard"
                ? styles.active
                : ""
            }`}
          >
            <FaHome className={styles.sidebarIcon} /> Dashboard
          </Link>
          <Link
            to="/personal-area/courses"
            className={`${styles.sidebarItem} ${
              location.pathname === "/personal-area/courses"
                ? styles.active
                : ""
            }`}
          >
            <FaBook className={styles.sidebarIcon} /> Courses
          </Link>
          <Link
            to="/personal-area/assignments"
            className={`${styles.sidebarItem} ${
              location.pathname === "/personal-area/assignments"
                ? styles.active
                : ""
            }`}
          >
            <FaTasks className={styles.sidebarIcon} /> Assignments
          </Link>
          <Link
            to="/personal-area/grades"
            className={`${styles.sidebarItem} ${
              location.pathname === "/personal-area/grades" ? styles.active : ""
            }`}
          >
            <FaGraduationCap className={styles.sidebarIcon} /> Grades
          </Link>
          <Link
            to="/personal-area/calendar"
            className={`${styles.sidebarItem} ${
              location.pathname === "/personal-area/calendar"
                ? styles.active
                : ""
            }`}
          >
            <FaCalendar className={styles.sidebarIcon} /> Calendar
          </Link>
          <Link
            to="/personal-area/forum"
            className={`${styles.sidebarItem} ${
              location.pathname === "/personal-area/forum" ? styles.active : ""
            }`}
          >
            <FaComments className={styles.sidebarIcon} /> Forum
          </Link>
          <Link
            to="/personal-area/settings"
            className={`${styles.sidebarItem} ${
              location.pathname === "/personal-area/settings"
                ? styles.active
                : ""
            }`}
          >
            <FaCog className={styles.sidebarIcon} /> Settings
          </Link>
          <Link
            to="/personal-area/profile"
            className={`${styles.sidebarItem} ${
              location.pathname === "/personal-area/profile" ? styles.active : ""
            }`}
          >
            <FaUser className={styles.sidebarIcon} /> Profile
          </Link>
        </nav>

        <main className={styles.content}>
          <div className={styles.breadcrumbs}>
            {getBreadcrumbs().map((breadcrumb, index) => (
              <span key={index}>
                <Link to={breadcrumb.path}>{breadcrumb.name}</Link>
                {index < getBreadcrumbs().length - 1 && " > "}
              </span>
            ))}
          </div>
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2023 HebrewClub. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/contact">Contact Us</a>
        </div>
      </footer>

      <button className={styles.sidebarToggle} onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={styles.floatingActionButton}>
        <FaPlus />
        <span className={styles.fabTooltip}>Add New</span>
      </div>

      <button
        className={`${styles.backToTop} ${showBackToTop ? styles.visible : ""}`}
        onClick={scrollToTop}
      >
        <FaChevronUp />
      </button>
    </div>
  );
};

export default PersonalArea;