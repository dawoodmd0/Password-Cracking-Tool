import { useState, useEffect } from 'react';
import api from '../services/api';
import ResultCard from '../components/ResultCard';

const CrackingLab = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [attackStatus, setAttackStatus] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  const handleUserSelect = (e) => {
    const user = users.find(u => u.id === parseInt(e.target.value));
    setSelectedUser(user);
    setResult(null);
    setAttackStatus('');
  };

  const runAttack = async (type) => {
    if (!selectedUser) return;
    
    setResult(null);
    let step = 0;
    const statuses = [
      "Preparing attack...",
      "Testing candidates...",
      "Comparing hashes...",
      "Attack completed."
    ];
    
    const interval = setInterval(() => {
      if (step < statuses.length) {
        setAttackStatus(statuses[step]);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 300);

    try {
      let endpoint = '';
      if (type === 'dictionary') endpoint = '/attack/dictionary';
      if (type === 'hybrid') endpoint = '/attack/hybrid';
      if (type === 'rainbow') endpoint = '/attack/rainbow';

      const response = await api.post(endpoint, { target_hash: selectedUser.password_hash });
      
      setTimeout(() => {
        clearInterval(interval);
        setAttackStatus('Attack completed.');
        setResult(response.data);
      }, 1500); // Artificial small delay to let the UI show the states
      
    } catch (err) {
      clearInterval(interval);
      setAttackStatus('Attack failed due to error.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[var(--color-cyber-blue)] mb-2">Password Cracking Lab</h1>
      <p className="text-gray-400 mb-8">
        Select a target test account and execute different password recovery techniques against the unsalted SHA-256 hash.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="cyber-card mb-6">
            <h2 className="text-xl font-bold mb-4">1. Select Target</h2>
            <select 
              className="cyber-input mb-4" 
              onChange={handleUserSelect}
              defaultValue=""
            >
              <option value="" disabled>Select a test account...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username} (ID: {u.id})</option>
              ))}
            </select>

            {selectedUser && (
              <div className="bg-black/40 p-4 rounded border border-[var(--color-cyber-border)]">
                <p className="text-sm text-gray-400">Target Username</p>
                <p className="font-bold mb-3">{selectedUser.username}</p>
                
                <p className="text-sm text-gray-400">Hash</p>
                <p className="font-mono text-xs text-yellow-500 break-all mb-3">{selectedUser.password_hash}</p>
                
                <p className="text-sm text-gray-400">Hash Algorithm</p>
                <p className="font-mono text-sm mb-3">SHA-256</p>

                <p className="text-sm text-gray-400">Salt</p>
                <p className="font-mono text-sm text-[var(--color-cyber-red)]">None</p>
              </div>
            )}
          </div>

          <div className={`cyber-card ${!selectedUser ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="text-xl font-bold mb-4">2. Choose Attack</h2>
            <div className="space-y-3">
              <button 
                onClick={() => runAttack('dictionary')} 
                className="cyber-button w-full flex justify-between items-center"
              >
                <span>Dictionary Attack</span>
                <span className="text-xs opacity-70">Wordlist matching</span>
              </button>
              
              <button 
                onClick={() => runAttack('hybrid')} 
                className="cyber-button w-full flex justify-between items-center"
              >
                <span>Hybrid Attack</span>
                <span className="text-xs opacity-70">Wordlist + Mutations</span>
              </button>
              
              <button 
                onClick={() => runAttack('rainbow')} 
                className="cyber-button w-full flex justify-between items-center"
              >
                <span>Rainbow Table Attack</span>
                <span className="text-xs opacity-70">Precomputed Lookups</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="cyber-card min-h-[200px]">
            <h2 className="text-xl font-bold mb-4">Execution Log</h2>
            
            <div className="font-mono text-sm text-green-400 min-h-[100px] bg-black/60 p-4 rounded border border-[var(--color-cyber-border)]">
              {attackStatus ? (
                <p>{'>'} {attackStatus}</p>
              ) : (
                <p className="text-gray-500">{'>'} Waiting for attack selection...</p>
              )}
            </div>

            <ResultCard result={result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrackingLab;
