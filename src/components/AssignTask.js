import { useState } from "react";
import axios from "axios";

function AssignTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [document, setDocument] = useState(null);

  const handleAssignTask = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("assignedTo", assignedTo);
    formData.append("document", document);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/tasks/assign", formData, {
        headers: {
          "Authorization": token,
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Task assigned successfully!");
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setDocument(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to assign task.");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Assign Task</h2>
      <form onSubmit={handleAssignTask}>
        <div>
          <label>Title:</label><br />
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label><br />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>
        <div>
          <label>Assign To (User Email):</label><br />
          <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required />
        </div>
        <div>
          <label>Upload Document:</label><br />
          <input type="file" onChange={(e) => setDocument(e.target.files[0])} />
        </div>
        <br />
        <button type="submit">Assign Task</button>
      </form>
    </div>
  );
}

export default AssignTask;
