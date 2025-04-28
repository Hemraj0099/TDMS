import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login Failed. Please check your credentials.");
    }
  };

  return (
    <div style={{ margin: "50px" }}>
  <h2 style={{ textAlign: "center" }}>Login</h2>
  <form onSubmit={handleLogin}>
    <div>
      <label>Email:</label><br />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    </div>
    <div>
      <label>Password:</label><br />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
    </div>
    <br />
    <button type="submit">Login</button>
  </form>
  <p style={{ textAlign: "center" }}>
    Don't have an account? <a href="/signup">Signup</a>
  </p>
</div>

  );
}

export default Login;
