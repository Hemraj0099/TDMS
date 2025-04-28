import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AssignTask from "../components/AssignTask";
import TaskList from "../components/TaskList";
import CompletedTasks from "../components/CompletedTasks";
import Profile from "../components/profile";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [role, setRole] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/tasks/get", {
        headers: { Authorization: token }
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const completedTasks = tasks.filter(task => task.status === "Completed");
  const incompleteTasks = tasks.filter(task => task.status !== "Completed");

  const pieData = [
    { name: "Completed", value: completedTasks.length },
    { name: "Incomplete", value: incompleteTasks.length }
  ];

  const COLORS = ["#00C49F", "#FF8042"];

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="dashboard-content" style={{ flexGrow: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={
            <div>
              <h2>Dashboard Overview</h2>

              {/* Widgets */}
              <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <div style={{ background: "#007bff", color: "white", padding: "20px", borderRadius: "10px", flex: 1 }}>
                  <h3>Completed Tasks</h3>
                  <p style={{ fontSize: "24px" }}>{completedTasks.length}</p>
                </div>
                <div style={{ background: "#007bff", color: "white", padding: "20px", borderRadius: "10px", flex: 1 }}>
                  <h3>Incomplete Tasks</h3>
                  <p style={{ fontSize: "24px" }}>{incompleteTasks.length}</p>
                </div>
                <div style={{ background: "#007bff", color: "white", padding: "20px", borderRadius: "10px", flex: 1 }}>
                  <h3>Total Tasks</h3>
                  <p style={{ fontSize: "24px" }}>{tasks.length}</p>
                </div>
              </div>

              {/* Charts */}
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", flex: 1 }}>
                  <h4>Tasks by Completion Status</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", flex: 1 }}>
                  <h4>Task Count</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={pieData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          } />
          {role === "admin" && <Route path="/assign" element={<AssignTask />} />}
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/completed" element={<CompletedTasks />} />
          <Route path="/profile" element={<Profile />} />
          {role !== "admin" && <Route path="/assign" element={<Navigate to="/dashboard/tasks" />} />}
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
