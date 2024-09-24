import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaBook,
  FaUserPlus,
  FaCog,
  FaChevronUp,
  FaQuestion,
  FaFileExport,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import styles from "./AdminDashboard.module.css";
import { AdminProvider } from "./context/AdminContext";
// Lazy load components
const UserManagement = lazy(
  () => import("./components/UserManagement/UserManagement")
);
const CourseManagement = lazy(
  () => import("./components/CourseManagement/CourseManagement")
);

const LeadManagement = lazy(
  () => import("./components/LeadManagement/LeadManagement")
);
const SystemSettings = lazy(
  () => import("./components/SystemSettings/SystemSettings")
);

const AdminDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] =
    useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = (scrollPosition / windowHeight) * 100;
      setScrollProgress(progress);
      setShowBackToTop(scrollPosition > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "?") {
        setShowKeyboardShortcuts(!showKeyboardShortcuts);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showKeyboardShortcuts]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems = [
    { path: "/admin/users", icon: FaUser, label: "Users" },
    { path: "/admin/courses", icon: FaBook, label: "Courses" },
    { path: "/admin/leads", icon: FaUserPlus, label: "Leads" },
    { path: "/admin/settings", icon: FaCog, label: "Settings" },
  ];

  return (
    <div
      className={`${styles.dashboard} ${
        i18n.language === "he" ? styles.rtl : ""
      }`}
    >
      <div className={styles.adminContent}>
        <nav
          className={`${styles.sidebar} ${
            sidebarCollapsed ? styles.collapsed : ""
          }`}
        >
          <button className={styles.sidebarToggle} onClick={toggleSidebar}>
            {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${
                location.pathname === item.path ? styles.active : ""
              }`}
            >
              <item.icon />
              {!sidebarCollapsed && (
                <span>{t(`admin.nav.${item.label.toLowerCase()}`)}</span>
              )}
            </Link>
          ))}
        </nav>

        <main
          className={`${styles.content} ${
            sidebarCollapsed ? styles.expanded : ""
          }`}
        >
          <div className={styles.breadcrumbs}>
            <Link to="/admin">Dashboard</Link>
            {location.pathname
              .split("/")
              .slice(2)
              .map((path) => (
                <React.Fragment key={path}>
                  <span> / </span>
                  <Link to={`/admin/${path}`}>
                    {t(`admin.nav.${path.toLowerCase()}`)}
                  </Link>
                </React.Fragment>
              ))}
          </div>

          <div className={styles.customizableDashboard}>
            {/* Add customizable widgets here */}
          </div>

          <Suspense
            fallback={<div className={styles.loadingIndicator}>Loading...</div>}
          > <AdminProvider>
            <Routes>
              <Route index element={<div>Welcome to Admin Dashboard</div>} />
              <Route path="users" element={<UserManagement />} />
              <Route path="courses" element={<CourseManagement />} />
              <Route path="leads" element={<LeadManagement />} />
              <Route path="settings" element={<SystemSettings />} />
            </Routes>
            </AdminProvider>
          </Suspense>
        </main>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="/terms">{t("admin.footer.terms")}</a>
          <a href="/privacy">{t("admin.footer.privacy")}</a>
          <a href="/contact">{t("admin.footer.contact")}</a>
        </div>
        <div className={styles.copyright}>
          &copy; 2024 Admin Dashboard. All rights reserved.
        </div>
      </footer>

      <motion.button
        className={`${styles.backToTop} ${showBackToTop ? styles.visible : ""}`}
        onClick={scrollToTop}
        initial={{ opacity: 0 }}
        animate={{ opacity: showBackToTop ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <FaChevronUp />
      </motion.button>

      <button className={styles.needHelp}>
        <FaQuestion />
      </button>

      <div className={styles.quickActionMenu}>
        <button className={styles.quickActionButton} title="Favorites">
          <FaStar />
        </button>
        <button className={styles.quickActionButton} title="Export">
          <FaFileExport />
        </button>
        <button className={styles.quickActionButton} title="Help">
          <FaQuestion />
        </button>
      </div>

      {showKeyboardShortcuts && (
        <div className={styles.keyboardShortcuts}>
          <h3>Keyboard Shortcuts</h3>
          <ul>
            <li>
              <kbd>?</kbd> - Toggle this menu
            </li>
            <li>
              <kbd>Ctrl</kbd> + <kbd>F</kbd> - Focus search bar
            </li>
            <li>
              <kbd>Esc</kbd> - Close modals
            </li>
            {/* Add more shortcuts as needed */}
          </ul>
        </div>
      )}

      <div className={styles.scrollProgress}>
        <div
          className={styles.scrollProgressBar}
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className={styles.modalContent}>
              {/* Modal content goes here */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        className={styles.skipToContent}
        onClick={() => document.querySelector("main")?.focus()}
      >
        Skip to main content
      </button>

      <button
        className={styles.feedbackButton}
        onClick={() => setIsModalOpen(true)}
      >
        Feedback
      </button>

      <div className={styles.onboardingTour}>
        <button onClick={() => console.log("Start onboarding tour")}>
          Take a Tour
        </button>
      </div>

      <div className={styles.statusIndicator}>
        <div className={`${styles.statusDot} ${styles.green}`}></div>
        <span>System Status: Operational</span>
      </div>

    </div>
  );
};

export default AdminDashboard;
