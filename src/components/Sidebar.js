import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  let role = "user"; // default role
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role;
  }

  return (
    <div className="sidebar">
      <h3>Task Manager</h3>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/dashboard/tasks">Tasks</Link></li>
        {role === "admin" && (
          <li><Link to="/dashboard/assign">Assign Task</Link></li>
        )}
        <li><Link to="/dashboard/completed">Completed</Link></li>
        <li><Link to="/dashboard/profile">Profile</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </div>
  );
}

export default Sidebar;
