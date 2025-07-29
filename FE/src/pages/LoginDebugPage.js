import React, { useState } from 'react';
import axios from 'axios';

function LoginDebugPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", form);
      setResponse(res.data);
      console.log("Login response:", res.data);
    } catch (err) {
      setError("Sai email hoặc mật khẩu.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Login Debug</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="password"
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Test Login
          </button>
        </form>

        {response && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h3 className="font-bold mb-2">Response từ Backend:</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(response, null, 2)}
            </pre>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <h4 className="font-semibold text-blue-800">Thông tin chuyển hướng:</h4>
              <p className="text-sm text-blue-700">
                Role: <strong>{response.role}</strong>
              </p>
              <p className="text-sm text-blue-700">
                Sẽ chuyển hướng đến: <strong>
                  {response.role === "ADMIN" 
                    ? "/admin-dashboard" 
                    : response.role === "EMPLOYER" 
                    ? "/recruiter-dashboard" 
                    : response.role === "CANDIDATE" 
                    ? "/" 
                    : "/"
                  }
                </strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginDebugPage;
