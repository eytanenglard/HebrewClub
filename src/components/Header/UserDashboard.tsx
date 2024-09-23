import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./UserDashboard.module.css";
import { useAuth } from "../../context/AuthContext"; // Adjust the import path as needed

const UserDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  // Placeholder data - replace with actual data fetching logic
  const courseProgress = 75;
  const recentActivity = [
    { id: 1, activity: "Completed Lesson 3 in Hebrew Basics" },
    { id: 2, activity: "Achieved 100% in Quiz: Greetings" },
    { id: 3, activity: "Started new course: Advanced Conversation" },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {t("userDashboard.welcome", { name: currentUser?.name })}
        </h1>
      </header>
      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            {t("userDashboard.courseProgress")}
          </h2>
          <div className={styles.cardContent}>
            <p>
              {t("userDashboard.progressPercentage", {
                progress: courseProgress,
              })}
            </p>
            {/* Add a progress bar component here */}
          </div>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            {t("userDashboard.recentActivity")}
          </h2>
          <div className={styles.cardContent}>
            <ul>
              {recentActivity.map((activity) => (
                <li key={activity.id}>{activity.activity}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            {t("userDashboard.upcomingLessons")}
          </h2>
          <div className={styles.cardContent}>
            {/* Add upcoming lessons component or list here */}
            <p>{t("userDashboard.noUpcomingLessons")}</p>
          </div>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            {t("userDashboard.achievements")}
          </h2>
          <div className={styles.cardContent}>
            {/* Add achievements component here */}
            <p>{t("userDashboard.noAchievementsYet")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
