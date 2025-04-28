import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", { fullName, email, password });
      alert("Registration successful. Please login!");
      navigate("/");
    } catch (err) {
        console.error(err.response?.data || err.message); // 👈 ADD this line temporarily
      alert("Signup Failed. Try different email.");
    }
  };

  return (
    <div style={{ margin: "50px" }}>
  <h2 style={{ textAlign: "center" }}>Signup</h2>
  <form onSubmit={handleSignup}>
    <div>
      <label>Full Name:</label><br />
      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
    </div>
    <div>
      <label>Email:</label><br />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    </div>
    <div>
      <label>Password:</label><br />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
    </div>
    <br />
    <button type="submit">Signup</button>
  </form>
  <p style={{ textAlign: "center" }}>
    Already have an account? <a href="/">Login</a>
  </p>
</div>
  );
}

export default Signup;
