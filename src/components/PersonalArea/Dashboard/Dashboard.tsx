import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import styles from "./Dashboard.module.css";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={styles.dashboard}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      ref={ref}
    >
      <h1>{t("dashboard.welcome")}</h1>
      <div className={styles.cardContainer}>
        <motion.div className={styles.card} variants={cardVariants}>
          <h2>{t("dashboard.upcomingAssignments")}</h2>
          <p>{t("dashboard.assignmentsCount", { count: 3 })}</p>
        </motion.div>
        <motion.div className={styles.card} variants={cardVariants}>
          <h2>{t("dashboard.courseProgress")}</h2>
          <p>{t("dashboard.progressPercentage", { percentage: 60 })}</p>
        </motion.div>
        <motion.div className={styles.card} variants={cardVariants}>
          <h2>{t("dashboard.recentGrades")}</h2>
          <p>{t("dashboard.latestTestScore", { score: 85 })}</p>
        </motion.div>
        <motion.div className={styles.card} variants={cardVariants}>
          <h2>{t("dashboard.upcomingEvents")}</h2>
          <p>{t("dashboard.nextLiveSession", { time: "18:00" })}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default React.memo(Dashboard);
