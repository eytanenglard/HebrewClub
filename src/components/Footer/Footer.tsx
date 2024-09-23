import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h3>על החברה</h3>
          <p>אנחנו מחויבים ללימוד עברית איכותי ונגיש לכולם.</p>
        </div>
        <div className={styles.column}>
          <h3>קישורים מהירים</h3>
          <ul>
            <li>
              <a href="/about">אודות</a>
            </li>
            <li>
              <a href="/courses">קורסים</a>
            </li>
            <li>
              <a href="/blog">בלוג</a>
            </li>
            <li>
              <a href="/contact">צור קשר</a>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>הירשם לניוזלטר</h3>
          <form>
            <input type="email" placeholder="הכנס את כתובת האימייל שלך" />
            <button type="submit">הירשם</button>
          </form>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; 2024 The Hebrew Club. כל הזכויות שמורות.</p>
      </div>
    </footer>
  );
};

export default Footer;
