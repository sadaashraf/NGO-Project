import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembers } from './MembersContext';

function Login() {
  const [email, setEmail] = useState('');
  const { login } = useMembers();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(email);
    navigate('/'); // admins go to form, members to dashboard (handled in App)
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email/Phone (for demo)</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="admin1@example.com or your phone"
          />
          <button
            type="submit"
            className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;