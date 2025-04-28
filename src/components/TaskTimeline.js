import { useState, useEffect } from "react";
import axios from "axios";

function TaskTimeline({ taskId, onClose }) {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/tasks/history/${taskId}`, {
        headers: { Authorization: token }
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to fetch history.");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [taskId]);

  return (
    <div style={{ position: "fixed", top: "20%", left: "30%", width: "40%", background: "#fff", padding: "20px", border: "2px solid gray", borderRadius: "10px", zIndex: 1000 }}>
      <h2>Task Timeline</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
        {history.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {history.map((item, index) => (
              <li key={index} style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                <strong>{item.action}</strong><br />
                <small>by {item.by}</small><br />
                <small>{new Date(item.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No history available for this task.</p>
        )}
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default TaskTimeline;
