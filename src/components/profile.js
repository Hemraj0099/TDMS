import React, { useState, useEffect } from "react"; // ✅ correct imports
import { jwtDecode } from "jwt-decode"; // ✅ import jwtDecode

function Profile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  return (
    <div className="container">
      <h2>My Profile</h2>
      <p><strong>Full Name:</strong> {user.fullName || "N/A"}</p>
      <p><strong>Email:</strong> {user.email || "N/A"}</p>
      <p><strong>Role:</strong> {user.role || "user"}</p>
    </div>
  );
}

export default Profile; // ✅ correct export
