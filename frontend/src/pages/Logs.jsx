import { useState, useEffect } from 'react';
import { Terminal, Database, Cpu, RefreshCw, CheckCircle, Search, Filter } from 'lucide-react';
import api from '../services/api';

const Logs = () => {
  const [activeTab, setActiveTab] = useState('rainbow'); // 'rainbow', 'hybrid', 'dictionary'
  const [rainbowData, setRainbowData] = useState({ total_entries: 0, entries: [] });
  const [loadingRainbow, setLoadingRainbow] = useState(false);
  const [regeneratingRainbow, setRegeneratingRainbow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // User selection & target hash
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('full');
  const [testUserHash, setTestUserHash] = useState('full_scan');
  
  const [dictionaryLog, setDictionaryLog] = useState(null);
  const [hybridLog, setHybridLog] = useState(null);
  const [runningDict, setRunningDict] = useState(false);
  const [runningHybrid, setRunningHybrid] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRainbowTable();
    runSampleDictionaryLog('full_scan');
    runSampleHybridLog('full_scan');
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleUserChange = (e) => {
    const val = e.target.value;
    setSelectedUserId(val);
    if (val === 'full') {
      setTestUserHash('full_scan');
      runSampleDictionaryLog('full_scan');
      runSampleHybridLog('full_scan');
    } else {
      const user = users.find(u => u.id === parseInt(val));
      if (user) {
        setTestUserHash(user.password_hash);
        runSampleDictionaryLog(user.password_hash);
        runSampleHybridLog(user.password_hash);
      }
    }
  };

  const fetchRainbowTable = async () => {
    setLoadingRainbow(true);
    try {
      const res = await api.get('/rainbow-table');
      setRainbowData(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to load rainbow table", err);
    } finally {
      setLoadingRainbow(false);
    }
  };

  const handleRegenerateRainbow = async () => {
    setRegeneratingRainbow(true);
    try {
      await api.post('/rainbow-table/generate');
      await fetchRainbowTable();
    } catch (err) {
      console.error("Failed to regenerate rainbow table", err);
    } finally {
      setRegeneratingRainbow(false);
    }
  };

  const runSampleDictionaryLog = async (overrideHash) => {
    setRunningDict(true);
    setDictionaryLog(null); // Reset log state so UI visually updates immediately
    const hashToUse = overrideHash !== undefined ? overrideHash : testUserHash;
    
    // Add small visible animation delay so the user feels the re-computation execution
    setTimeout(async () => {
      try {
        const res = await api.post('/attack/dictionary', { target_hash: hashToUse });
        setDictionaryLog(res.data);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
         console.error("Error running dictionary log inspection", err);
      } finally {
        setRunningDict(false);
      }
    }, 400);
  };

  const runSampleHybridLog = async (overrideHash) => {
    setRunningHybrid(true);
    setHybridLog(null); // Reset log state so UI visually updates immediately
    const hashToUse = overrideHash !== undefined ? overrideHash : testUserHash;
    
    setTimeout(async () => {
      try {
        const res = await api.post('/attack/hybrid', { target_hash: hashToUse });
        setHybridLog(res.data);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Error running hybrid log inspection", err);
      } finally {
        setRunningHybrid(false);
      }
    }, 400);
  };

  const filteredRainbowEntries = rainbowData.entries.filter(
    e => e.plaintext.toLowerCase().includes(searchQuery.toLowerCase()) ||
         e.hash.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--color-cyber-card)] p-4 rounded border border-[var(--color-cyber-border)]">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-cyber-blue)] flex items-center gap-3">
            <Terminal className="text-[var(--color-cyber-green)]" size={32} />
            Computation & Log Navigation
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Inspect candidate evaluations for dictionary & hybrid attacks and inspect stored precomputed rainbow table mappings.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Target Account / Hash Mode</label>
            <select
              value={selectedUserId}
              onChange={handleUserChange}
              className="cyber-input text-sm py-1.5 px-3 bg-black/60 border border-[var(--color-cyber-border)]"
            >
              <option value="full">Full Wordlist Scan (All Candidates)</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  User: {u.username} ({u.password_hash.substring(0, 10)}...)
                </option>
              ))}
            </select>
          </div>
          {lastUpdated && (
            <div className="text-right text-xs text-gray-400 self-end pb-1">
              <span>Last updated: </span>
              <span className="text-[var(--color-cyber-green)] font-mono">{lastUpdated}</span>
            </div>
          )}
        </div>
      </div>


      {/* Log Navigation Tabs */}
      <div className="flex border-b border-[var(--color-cyber-border)] space-x-2">
        <button
          onClick={() => setActiveTab('rainbow')}
          className={`px-5 py-3 font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'rainbow'
              ? 'border-[var(--color-cyber-green)] text-[var(--color-cyber-green)] bg-white/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Database size={18} />
          Rainbow Table (Precomputed)
          <span className="ml-2 bg-green-950 text-green-400 text-xs px-2 py-0.5 rounded-full font-mono">
            {rainbowData.total_entries} Entries
          </span>
        </button>

        <button
          onClick={() => setActiveTab('hybrid')}
          className={`px-5 py-3 font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'hybrid'
              ? 'border-[var(--color-cyber-blue)] text-[var(--color-cyber-blue)] bg-white/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Cpu size={18} />
          Hybrid Attack Computations
          {hybridLog && (
            <span className="ml-2 bg-blue-950 text-blue-400 text-xs px-2 py-0.5 rounded-full font-mono">
              {hybridLog.computed_entries?.length || 0} Tested
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('dictionary')}
          className={`px-5 py-3 font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'dictionary'
              ? 'border-[var(--color-cyber-purple)] text-[var(--color-cyber-purple)] bg-white/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Filter size={18} />
          Dictionary Attack Computations
          {dictionaryLog && (
            <span className="ml-2 bg-purple-950 text-purple-400 text-xs px-2 py-0.5 rounded-full font-mono">
              {dictionaryLog.computed_entries?.length || 0} Tested
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Rainbow Table Precomputed Entries */}
      {activeTab === 'rainbow' && (
        <div className="space-y-4">
          <div className="cyber-card flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Precomputed Rainbow Table Key Space
              </h2>
              <p className="text-sm text-gray-400">
                Rainbow table precomputes candidates into an indexed lookup dictionary <code className="text-yellow-400">rainbow_table.json</code> for instant O(1) matching.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search hash or plaintext..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="cyber-input pl-9 text-sm py-2 w-64"
                />
              </div>
              <button
                onClick={handleRegenerateRainbow}
                disabled={regeneratingRainbow}
                className="cyber-button flex items-center gap-2 text-sm whitespace-nowrap"
              >
                <RefreshCw size={14} className={regeneratingRainbow ? 'animate-spin' : ''} />
                {regeneratingRainbow ? 'Regenerating...' : 'Re-generate Table'}
              </button>
            </div>
          </div>

          <div className="cyber-card overflow-hidden">
            {loadingRainbow ? (
              <p className="p-8 text-center text-gray-400">Loading precomputed table data...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-cyber-border)] bg-black/40 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-3">#</th>
                      <th className="p-3">Target SHA-256 Hash</th>
                      <th className="p-3">Precomputed Plaintext</th>
                      <th className="p-3">Lookup Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-cyber-border)]/40 font-mono text-sm">
                    {filteredRainbowEntries.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-6 text-center text-gray-500">
                          No precomputed rainbow table entries match your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredRainbowEntries.map((entry, idx) => (
                        <tr key={entry.hash} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 text-gray-500 text-xs">{idx + 1}</td>
                          <td className="p-3 text-yellow-500 break-all text-xs">{entry.hash}</td>
                          <td className="p-3 text-[var(--color-cyber-green)] font-bold">{entry.plaintext}</td>
                          <td className="p-3 text-xs text-gray-400">
                            <span className="inline-flex items-center gap-1 text-green-400 bg-green-950/60 px-2 py-0.5 rounded border border-green-800">
                              <CheckCircle size={12} /> Precalculated
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Hybrid Attack Computations */}
      {activeTab === 'hybrid' && (
        <div className="space-y-4">
          <div className="cyber-card flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Hybrid Attack Candidate Computations Log</h2>
              <p className="text-sm text-gray-400">
                Hybrid attacks generate candidate passwords by combining base dictionary words with specific mutation rules (prefixes/suffixes).
              </p>
            </div>
            <button
              onClick={runSampleHybridLog}
              disabled={runningHybrid}
              className="cyber-button flex items-center gap-2 text-sm"
            >
              <RefreshCw size={14} className={runningHybrid ? 'animate-spin' : ''} />
              Re-compute Hybrid Candidates
            </button>
          </div>

          <div className="cyber-card">
            {!hybridLog || !hybridLog.computed_entries ? (
              <p className="p-6 text-center text-gray-500">Running hybrid candidate computations...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-cyber-border)] bg-black/40 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-3">Step</th>
                      <th className="p-3">Base Word</th>
                      <th className="p-3">Mutation</th>
                      <th className="p-3">Computed Candidate</th>
                      <th className="p-3">Generated SHA-256 Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-cyber-border)]/40 font-mono text-sm">
                    {hybridLog.computed_entries.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 text-gray-500 text-xs">{idx + 1}</td>
                        <td className="p-3 text-blue-400">{item.base_word}</td>
                        <td className="p-3 text-yellow-400 text-xs">{item.mutation}</td>
                        <td className="p-3 text-white font-semibold">{item.candidate}</td>
                        <td className="p-3 text-gray-400 text-xs break-all">{item.hash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Dictionary Attack Computations */}
      {activeTab === 'dictionary' && (
        <div className="space-y-4">
          <div className="cyber-card flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Dictionary Attack Candidate Computations Log</h2>
              <p className="text-sm text-gray-400">
                Dictionary attacks iterate sequentially through wordlists, computing SHA-256 hashes for each word.
              </p>
            </div>
            <button
              onClick={runSampleDictionaryLog}
              disabled={runningDict}
              className="cyber-button flex items-center gap-2 text-sm"
            >
              <RefreshCw size={14} className={runningDict ? 'animate-spin' : ''} />
              Re-compute Dictionary Candidates
            </button>
          </div>

          <div className="cyber-card">
            {!dictionaryLog || !dictionaryLog.computed_entries ? (
              <p className="p-6 text-center text-gray-500">Running dictionary candidate computations...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-cyber-border)] bg-black/40 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-3">Iteration</th>
                      <th className="p-3">Tested Wordlist Entry</th>
                      <th className="p-3">Computed SHA-256 Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-cyber-border)]/40 font-mono text-sm">
                    {dictionaryLog.computed_entries.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 text-gray-500 text-xs">{idx + 1}</td>
                        <td className="p-3 text-purple-300 font-semibold">{item.candidate}</td>
                        <td className="p-3 text-gray-400 text-xs break-all">{item.hash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Logs;
