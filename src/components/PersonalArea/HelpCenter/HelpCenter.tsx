import React, { useState } from 'react';
import { FaSearch, FaQuestionCircle } from 'react-icons/fa';
import styles from './HelpCenter.module.css';

const faqData = [
  { question: 'איך אני מתחיל קורס חדש?', answer: 'כדי להתחיל קורס חדש, לך לעמוד "הקורסים שלי" ולחץ על "הירשם לקורס חדש". בחר את הקורס הרצוי ועקוב אחר ההוראות להרשמה.' },
  { question: 'איך אני מגיש מטלה?', answer: 'כדי להגיש מטלה, פתח את הקורס הרלוונטי, מצא את המטלה בחומרי הקורס, ולחץ על "הגש מטלה". העלה את הקובץ שלך ולחץ על "שלח".' },
  { question: 'איך אני יכול ליצור קשר עם המורה שלי?', answer: 'ניתן ליצור קשר עם המורה דרך מערכת ההודעות באתר. לך לעמוד "הודעות", לחץ על "הודעה חדשה", ובחר את המורה מרשימת אנשי הקשר.' },
  // הוסף עוד שאלות ותשובות כאן
];

const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFAQ, setFilteredFAQ] = useState(faqData);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = faqData.filter(item => 
      item.question.toLowerCase().includes(term.toLowerCase()) || 
      item.answer.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredFAQ(filtered);
  };

  return (
    <div className={styles.helpCenter}>
      <h1 className={styles.title}>מרכז עזרה</h1>
      <div className={styles.searchBar}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="חפש שאלות ותשובות..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.faqSection}>
        <h2>שאלות נפוצות</h2>
        {filteredFAQ.length > 0 ? (
          filteredFAQ.map((item, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.question}>
                <FaQuestionCircle className={styles.questionIcon} />
                {item.question}
              </h3>
              <p className={styles.answer}>{item.answer}</p>
            </div>
          ))
        ) : (
          <p>לא נמצאו תוצאות מתאימות. נסה לחפש מונח אחר.</p>
        )}
      </div>
      <div className={styles.contactSupport}>
        <h2>צור קשר עם התמיכה</h2>
        <p>אם לא מצאת תשובה לשאלתך, אנא צור קשר עם צוות התמיכה שלנו:</p>
        <button className={styles.contactButton}>צור קשר</button>
      </div>
    </div>
  );
};

export default HelpCenter;