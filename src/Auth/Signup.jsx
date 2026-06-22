import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Api from "../Api/Api";
import logo from "../../public/logo4.jpg";


export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${Api}/users`, { user: form });
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Check your details.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="App Logo"
            className="h-28 w-auto object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border rounded-lg px-4 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border rounded-lg px-4 py-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded-lg px-4 py-2"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="border rounded-lg px-4 py-2"
            value={form.password_confirmation}
            onChange={(e) =>
              setForm({ ...form, password_confirmation: e.target.value })
            }
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-green-600 text-white rounded-lg py-2 hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

