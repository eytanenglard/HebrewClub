import styles from "./LoadingSpinner.module.css"; // נייבא את קובץ ה-CSS המודולרי

const LoadingSpinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingSpinner;
