import React, { useState, useEffect } from "react";

interface VocabularyItem {
  word: string;
  definition: string;
  example: string;
}

interface VocabularyBuilderProps {
  lessonId: string;
}

const VocabularyBuilder: React.FC<VocabularyBuilderProps> = ({ lessonId }) => {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [newWord, setNewWord] = useState("");
  const [newDefinition, setNewDefinition] = useState("");
  const [newExample, setNewExample] = useState("");

  useEffect(() => {
    // כאן תהיה קריאה לAPI לקבלת אוצר מילים קיים
    const fetchVocabulary = async () => {
      // לדוגמה בלבד, יש להחליף עם קריאת API אמיתית
      const mockVocabulary: VocabularyItem[] = [
        { word: "שלום", definition: "ברכה", example: "שלום, מה שלומך?" },
        {
          word: "תודה",
          definition: "הבעת הכרת תודה",
          example: "תודה רבה על העזרה.",
        },
      ];
      setVocabulary(mockVocabulary);
    };

    fetchVocabulary();
  }, [lessonId]);

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    // כאן תהיה קריאה לAPI להוספת מילה חדשה
    const newItem: VocabularyItem = {
      word: newWord,
      definition: newDefinition,
      example: newExample,
    };
    setVocabulary([...vocabulary, newItem]);
    setNewWord("");
    setNewDefinition("");
    setNewExample("");
  };

  return (
    <div className="vocabulary-builder">
      <h3>בונה אוצר מילים</h3>
      <form onSubmit={handleAddWord}>
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="מילה חדשה"
          required
        />
        <input
          type="text"
          value={newDefinition}
          onChange={(e) => setNewDefinition(e.target.value)}
          placeholder="הגדרה"
          required
        />
        <input
          type="text"
          value={newExample}
          onChange={(e) => setNewExample(e.target.value)}
          placeholder="דוגמה לשימוש"
          required
        />
        <button type="submit">הוסף מילה</button>
      </form>
      <ul>
        {vocabulary.map((item, index) => (
          <li key={index}>
            <strong>{item.word}</strong>: {item.definition}
            <p>דוגמה: {item.example}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VocabularyBuilder;
