import React, { useState, useEffect } from "react";
import styles from "./PaymentManagement.module.css";

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // כאן יש להוסיף קריאה לAPI לקבלת רשימת התשלומים
    // לדוגמה:
    // fetchPayments().then(data => setPayments(data));
  }, []);

  return (
    <div className={styles.paymentManagement}>
      <h2>ניהול תשלומים</h2>
      <table className={styles.paymentTable}>
        <thead>
          <tr>
            <th>מספר עסקה</th>
            <th>שם המשלם</th>
            <th>סכום</th>
            <th>תאריך</th>
            <th>סטטוס</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment: any) => (
            <tr key={payment.id}>
              <td>{payment.transactionId}</td>
              <td>{payment.payerName}</td>
              <td>{payment.amount}</td>
              <td>{payment.date}</td>
              <td>{payment.status}</td>
              <td>
                <button>פרטים</button>
                <button>החזר כספי</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentManagement;
