import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Payments.module.css";
import { useAuth } from "../../../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

interface Payment {
  id: string;
  amount: number;
  date: string;
  status: string;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchPayments();
  }, [currentUser]);

  const fetchPayments = async () => {
    try {
      if (!currentUser) {
        setError("User is not authenticated");
        return;
      }
      let _id = currentUser._id;
      const response = await axios.get(`${API_BASE_URL}/payments/${_id}`);
      setPayments(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to fetch payments. Please try again later.");
    }
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.payments}>
      <h1>Your Payments</h1>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className={styles.paymentTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{new Date(payment.date).toLocaleDateString()}</td>
                <td>${payment.amount.toFixed(2)}</td>
                <td>{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Payments;
