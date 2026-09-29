import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage("Username and password are required.");
      setIsError(true);
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsError(true);
      return;
    }

    try {
      const response = await api.post('/register', { username, password });
      setMessage(`Test account '${response.data.username}' created successfully.`);
      setIsError(false);
      setTimeout(() => navigate('/cracking'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Registration failed.");
      setIsError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto cyber-card mt-10">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-cyber-blue)]">Create Test Account</h2>
      
      <p className="text-sm text-gray-400 mb-6 pb-4 border-b border-[var(--color-cyber-border)]">
        Register a local test account to demonstrate password cracking. Passwords are intentionally stored as unsalted SHA-256 hashes.
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
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
          <input 
            type="password" 
            className="cyber-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        
        <button type="submit" className="cyber-button w-full mt-4 bg-[var(--color-cyber-blue)]/10">
          Create Test Account
        </button>
      </form>
    </div>
  );
};

export default Register;
