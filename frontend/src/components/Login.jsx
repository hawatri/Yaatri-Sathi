import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        'http://localhost:6969/api/auth/login', 
        formData,
        { withCredentials: true } //  For sending/receiving cookies
      );
      
      console.log("Login successful:", response.data);
      
      // After a successful login, navigate to the main part of your app
      navigate('/'); 

    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-black px-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-white text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email} 
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Password</label>
            <input
              type="password"
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Enter password"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition mt-4 disabled:bg-blue-400"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-gray-300 text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/sign-up" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}