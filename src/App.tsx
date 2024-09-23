import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useParams,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import AdminDashboard from "./admin/AdminDashboard";
import UserDashboard from "./components/Header/UserDashboard";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import Header from "./components/Header/Header";
import PersonalArea from "./components/PersonalArea/PersonalArea";
import CourseManagement from "./components/CourseManagement/CourseManagement";
import CoursePage from "./components/CoursePage/CoursePage";
import Payment from "./components/Courses/Payment";
import ResetPassword from "./components/Auth/ResetPassword";
import VerifyEmail from "./components/Auth/VerifyEmail";
import { useSearchParams } from "react-router-dom";

const ProtectedRoute: React.FC<{
  element: React.ReactElement;
  allowedRoles?: string[];
}> = ({ element, allowedRoles }) => {
  const { isLoggedIn, isChecking, currentUser } = useAuth();

  if (isChecking) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (
    allowedRoles &&
    (!currentUser || !allowedRoles.includes(currentUser.role.name))
  ) {
    return <Navigate to="/" />;
  }

  return element;
};
const ResetPasswordWrapper = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  return token ? <ResetPassword token={token} onClose={() => {}} /> : <div>Invalid reset link</div>;
};
const CoursePageWrapper = () => {
  const { courseId } = useParams<{ courseId: string }>();
  return courseId ? (
    <CoursePage courseId={courseId} />
  ) : (
    <div>קורס לא נמצא</div>
  );
};

const AppContent: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <Router>
      <Header
        onLoginClick={openLoginModal}
        onRegisterClick={openRegisterModal}
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onLoginClick={openLoginModal}
              onRegisterClick={openRegisterModal}
            />
          }
        />
        <Route
          path="/personal-area/*"
          element={<ProtectedRoute element={<PersonalArea />} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<div>Profile Page</div>} />}
        />
        <Route
          path="/user-dashboard"
          element={<ProtectedRoute element={<UserDashboard />} />}
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute
              element={<AdminDashboard />}
              allowedRoles={["admin"]}
            />
          }
        />
        <Route
          path="/admin-dashboard"
          element={<Navigate to="/admin" replace />}
        />
        <Route
          path="/courses"
          element={<ProtectedRoute element={<CourseManagement />} />}
        />
        <Route
          path="/course-management"
          element={<ProtectedRoute element={<CourseManagement />} />}
        />
        <Route
          path="/course/:courseId"
          element={<ProtectedRoute element={<CoursePageWrapper />} />}
        />
        <Route path="/payment" element={<Payment />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPasswordWrapper />} />
      </Routes>
      {showLoginModal && (
        <LoginPage onClose={closeModals} onRegister={openRegisterModal} />
      )}
      {showRegisterModal && (
        <RegisterPage onClose={closeModals} onLoginClick={openLoginModal} />
      )}
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
