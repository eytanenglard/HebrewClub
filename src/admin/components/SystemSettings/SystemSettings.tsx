import React, { useState, useEffect } from "react";
import styles from "./SystemSettings.module.css";

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: "",
    adminEmail: "",
    maxUploadSize: 0,
    allowRegistration: false,
    maintenanceMode: false,
  });

  useEffect(() => {
    // כאן יש להוסיף קריאה לAPI לקבלת ההגדרות הנוכחיות
    // לדוגמה:
    // fetchSettings().then(data => setSettings(data));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // כאן יש להוסיף קריאה לAPI לשמירת ההגדרות
    // לדוגמה:
    // saveSettings(settings).then(() => alert('ההגדרות נשמרו בהצלחה'));
  };

  return (
    <div className={styles.systemSettings}>
      <h2>הגדרות מערכת</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="siteName">שם האתר:</label>
          <input
            type="text"
            id="siteName"
            name="siteName"
            value={settings.siteName}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="adminEmail">אימייל מנהל:</label>
          <input
            type="email"
            id="adminEmail"
            name="adminEmail"
            value={settings.adminEmail}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="maxUploadSize">גודל העלאה מקסימלי (MB):</label>
          <input
            type="number"
            id="maxUploadSize"
            name="maxUploadSize"
            value={settings.maxUploadSize}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              name="allowRegistration"
              checked={settings.allowRegistration}
              onChange={handleInputChange}
            />
            אפשר הרשמה לאתר
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleInputChange}
            />
            מצב תחזוקה
          </label>
        </div>
        <button type="submit" className={styles.saveButton}>
          שמור הגדרות
        </button>
      </form>
    </div>
  );
};

export default SystemSettings;
