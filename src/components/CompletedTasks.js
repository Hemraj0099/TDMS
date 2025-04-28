import { useState, useEffect } from "react";
import axios from "axios";

function CompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState([]);

  const fetchCompletedTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/tasks/get", {
        headers: { Authorization: token }
      });

      // Filter only completed tasks
      const completed = res.data.filter(task => task.status === "Completed");
      setCompletedTasks(completed);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to fetch completed tasks.");
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h2>Completed Tasks</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Document</th>
          </tr>
        </thead>
        <tbody>
          {completedTasks.length > 0 ? (
            completedTasks.map(task => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.assignedTo}</td>
                <td>{task.status}</td>
                <td>
                  {task.document ? (
                    <a
                      href={`http://localhost:5000/uploads/${task.document}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    "No Document"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>No Completed Tasks</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CompletedTasks;
