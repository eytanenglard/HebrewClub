import React, { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import { DashboardStats } from "../../types/models";
import styles from "./Statistics.module.css";

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeCourses: 0,
    totalRevenue: 0,
    newLeads: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styles.statistics}>
      <h2>סטטיסטיקות</h2>
      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <h3>סה"כ משתמשים</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className={styles.statBox}>
          <h3>קורסים פעילים</h3>
          <p>{stats.activeCourses}</p>
        </div>
        <div className={styles.statBox}>
          <h3>סך הכנסות</h3>
          <p>₪{stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className={styles.statBox}>
          <h3>לידים חדשים</h3>
          <p>{stats.newLeads}</p>
        </div>
      </div>
      <div className={styles.charts}>
        {/* כאן תוכל להוסיף גרפים ותרשימים בהמשך */}
        <p>כאן יוצגו גרפים ותרשימים נוספים</p>
      </div>
    </div>
  );
};

export default Statistics;
