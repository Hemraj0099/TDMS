import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ✅ New import
import { toast } from "react-toastify"; // ✅ New import
import TaskTimeline from "./TaskTimeline"; // ✅ Import Timeline

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [action, setAction] = useState("");

  // 🆕 For Role and Timeline Popup
  const [role, setRole] = useState("");
  const [showTimeline, setShowTimeline] = useState(false);
  const [timelineTaskId, setTimelineTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/tasks/get", {
        headers: { Authorization: token }
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to fetch tasks.");
    }
  };

  const completeTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/tasks/complete/${taskId}`, {}, {
        headers: { Authorization: token }
      });
      toast.success("Task marked as Completed!");
      fetchTasks();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to complete task.");
    }
  };

  const updateStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/tasks/history/${selectedTaskId}`, {
        action
      }, {
        headers: { Authorization: token }
      });
      toast.success("Status updated successfully!");
      setSelectedTaskId(null);
      setAction("");
      fetchTasks();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to update status.");
    }
  };

  const viewTimeline = (taskId) => {
    setTimelineTaskId(taskId);
    setShowTimeline(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
    fetchTasks();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h2>Task List</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Title</th>
            <th>Description</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Document</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map(task => (
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
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {task.status !== "Completed" ? (
                      <button onClick={() => completeTask(task._id)}>Complete</button>
                    ) : (
                      <span style={{ color: "green" }}>Done</span>
                    )}
                    {role === "admin" && ( // ✅ Only Admin can Update Status
                      <button onClick={() => setSelectedTaskId(task._id)}>Update Status</button>
                    )}
                    <button onClick={() => viewTimeline(task._id)}>View Timeline</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No Tasks Available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Status Update Form */}
      {selectedTaskId && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid gray", borderRadius: "8px" }}>
          <h3>Update Status for Task</h3>
          <select value={action} onChange={(e) => setAction(e.target.value)} style={{ padding: "8px", width: "100%", marginBottom: "10px" }}>
            <option value="">Select an action</option>
            <option value="Document Requested">Document Requested</option>
            <option value="Task Approved">Task Approved</option>
            <option value="Task Rejected">Task Rejected</option>
            <option value="Additional Documents Required">Additional Documents Required</option>
          </select>
          <div>
            <button onClick={updateStatus} style={{ marginRight: "10px" }}>Submit Status Update</button>
            <button onClick={() => { setSelectedTaskId(null); setAction(""); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Timeline Modal */}
      {showTimeline && (
        <TaskTimeline
          taskId={timelineTaskId}
          onClose={() => {
            setShowTimeline(false);
            setTimelineTaskId(null);
          }}
        />
      )}
    </div>
  );
}

export default TaskList;
