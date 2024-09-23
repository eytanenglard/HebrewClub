import React, { useState, useEffect } from "react";
import { User } from "../../types/models";

interface PeerPracticeProps {
  courseId: string;
}

const PeerPractice: React.FC<PeerPracticeProps> = ({ courseId }) => {
  const [availablePeers, setAvailablePeers] = useState<User[]>([]);
  const [selectedPeer, setSelectedPeer] = useState<User | null>(null);

  useEffect(() => {
    // כאן תהיה קריאה לAPI לקבלת רשימת עמיתים זמינים לתרגול
    const fetchAvailablePeers = async () => {
      // לדוגמה בלבד, יש להחליף עם קריאת API אמיתית
      const mockPeers: User[] = [
        { _id: "1", name: "ישראל ישראלי", email: "israel@example.com" },
        { _id: "2", name: "שרה כהן", email: "sarah@example.com" },
      ];
      setAvailablePeers(mockPeers);
    };

    fetchAvailablePeers();
  }, [courseId]);

  const handleStartPractice = () => {
    if (selectedPeer) {
      // כאן תהיה לוגיקה ליצירת חיבור עם העמית הנבחר
      console.log(`Starting practice session with ${selectedPeer.name}`);
    }
  };

  return (
    <div className="peer-practice">
      <h3>תרגול עם עמיתים</h3>
      <select
        value={selectedPeer?._id || ""}
        onChange={(e) =>
          setSelectedPeer(
            availablePeers.find((peer) => peer._id === e.target.value) || null
          )
        }
      >
        <option value="">בחר עמית לתרגול</option>
        {availablePeers.map((peer) => (
          <option key={peer._id} value={peer._id}>
            {peer.name}
          </option>
        ))}
      </select>
      <button onClick={handleStartPractice} disabled={!selectedPeer}>
        התחל תרגול
      </button>
      {selectedPeer && (
        <div>
          <h4>פרטי העמית הנבחר:</h4>
          <p>שם: {selectedPeer.name}</p>
          <p>אימייל: {selectedPeer.email}</p>
        </div>
      )}
    </div>
  );
};

export default PeerPractice;
