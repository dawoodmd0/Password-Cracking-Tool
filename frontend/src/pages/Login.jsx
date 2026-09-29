import { useState } from 'react';
import api from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage("Username and password are required.");
      setIsError(true);
      return;
    }

    try {
      const response = await api.post('/login', { username, password });
      if (response.data.success) {
        setMessage(response.data.message);
        setIsError(false);
      } else {
        setMessage(response.data.message);
        setIsError(true);
      }
    } catch (err) {
      setMessage("Login request failed.");
      setIsError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto cyber-card mt-10">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-cyber-blue)]">Test Login</h2>
      
      <p className="text-sm text-gray-400 mb-6 pb-4 border-b border-[var(--color-cyber-border)]">
        Demonstrates standard login verification using the stored unsalted SHA-256 hash.
      </p>

      {message && (
        <div className={`p-3 mb-4 rounded ${isError ? 'bg-red-900/30 text-red-400 border border-red-500/50' : 'bg-green-900/30 text-green-400 border border-green-500/50'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
          <input 
            type="text" 
            className="cyber-input" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
          <input 
            type="password" 
            className="cyber-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button type="submit" className="cyber-button w-full mt-4 bg-[var(--color-cyber-blue)]/10">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
