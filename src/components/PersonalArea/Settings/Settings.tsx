import React, { useState } from "react";
import { FaBell, FaLanguage, FaMoon, FaLock, FaUser } from "react-icons/fa";
import styles from "./Settings.module.css";

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("he");
  const [darkMode, setDarkMode] = useState(false);

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    // כאן תוכל להוסיף לוגיקה להחלת מצב כהה על האפליקציה
  };

  return (
    <div className={styles.settings}>
      <h1 className={styles.title}>הגדרות</h1>

      <section className={styles.section}>
        <h2>
          <FaUser /> פרטים אישיים
        </h2>
        <button className={styles.button}>ערוך פרטים אישיים</button>
      </section>

      <section className={styles.section}>
        <h2>
          <FaBell /> התראות
        </h2>
        <div className={styles.toggleContainer}>
          <label htmlFor="notifications">קבל התראות</label>
          <input
            type="checkbox"
            id="notifications"
            checked={notifications}
            onChange={handleNotificationToggle}
            className={styles.toggle}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2>
          <FaLanguage /> שפה
        </h2>
        <select
          value={language}
          onChange={handleLanguageChange}
          className={styles.select}
        >
          <option value="he">עברית</option>
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </select>
      </section>

      <section className={styles.section}>
        <h2>
          <FaMoon /> מצב כהה
        </h2>
        <div className={styles.toggleContainer}>
          <label htmlFor="darkMode">הפעל מצב כהה</label>
          <input
            type="checkbox"
            id="darkMode"
            checked={darkMode}
            onChange={handleDarkModeToggle}
            className={styles.toggle}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2>
          <FaLock /> אבטחה
        </h2>
        <button className={styles.button}>שנה סיסמה</button>
        <button className={styles.button}>הפעל אימות דו-שלבי</button>
      </section>

      <button className={styles.saveButton}>שמור שינויים</button>
    </div>
  );
};

export default Settings;
