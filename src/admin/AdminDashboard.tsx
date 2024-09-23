import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaUser,
  FaBell,
  FaHome,
  FaBook,
  FaTasks,
  FaGraduationCap,
  FaEnvelope,
  FaMoneyBillWave,
  FaUserPlus,
  FaChartBar,
  FaCog,
  FaBars,
  FaChevronUp,
  FaPlus,
  FaQuestion,
  FaLanguage,
  FaFileExport,
  FaCalendarAlt,
  FaStar,
  FaEye,
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
const TaskManagement = lazy(
  () => import("./components/TaskManagement/TaskManagement")
);
const GradeManagement = lazy(
  () => import("./components/GradeManagement/GradeManagement")
);
const MessageManagement = lazy(
  () => import("./components/MessageManagement/MessageManagement")
);
const PaymentManagement = lazy(
  () => import("./components/PaymentManagement/PaymentManagement")
);
const LeadManagement = lazy(
  () => import("./components/LeadManagement/LeadManagement")
);
const Statistics = lazy(() => import("./components/Statistics/Statistics"));
const SystemSettings = lazy(
  () => import("./components/SystemSettings/SystemSettings")
);

interface Notification {
  id: number;
  message: string;
  timestamp: Date;
  read: boolean;
}

const AdminDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] =
    useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
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
    // Simulating fetching notifications
    setNotifications([
      {
        id: 1,
        message: "New user registered",
        timestamp: new Date(),
        read: false,
      },
      { id: 2, message: "Course updated", timestamp: new Date(), read: false },
      {
        id: 3,
        message: "New payment received",
        timestamp: new Date(),
        read: false,
      },
    ]);
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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement global search functionality
    console.log("Searching for:", searchTerm);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const navItems = [
    { path: "/admin/users", icon: FaUser, label: "Users" },
    { path: "/admin/courses", icon: FaBook, label: "Courses" },
    { path: "/admin/tasks", icon: FaTasks, label: "Tasks" },
    { path: "/admin/grades", icon: FaGraduationCap, label: "Grades" },
    { path: "/admin/messages", icon: FaEnvelope, label: "Messages" },
    { path: "/admin/payments", icon: FaMoneyBillWave, label: "Payments" },
    { path: "/admin/leads", icon: FaUserPlus, label: "Leads" },
    { path: "/admin/statistics", icon: FaChartBar, label: "Statistics" },
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
              .map((path, index) => (
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
              <Route path="tasks" element={<TaskManagement />} />
              <Route path="grades" element={<GradeManagement />} />
              <Route path="messages" element={<MessageManagement />} />
              <Route path="payments" element={<PaymentManagement />} />
              <Route path="leads" element={<LeadManagement />} />
              <Route path="statistics" element={<Statistics />} />
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
