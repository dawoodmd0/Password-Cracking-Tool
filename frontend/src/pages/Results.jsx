import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../services/api';

const Results = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get('/attack-results');
      setResults(response.data);
    } catch (err) {
      console.error("Failed to fetch results");
    }
  };

  // Group and average data for charts
  const processChartData = () => {
    const dataMap = {
      'Dictionary Attack': { name: 'Dictionary', attempts: 0, time_taken: 0, count: 0 },
      'Hybrid Attack': { name: 'Hybrid', attempts: 0, time_taken: 0, count: 0 },
      'Rainbow Table Attack': { name: 'Rainbow Table', attempts: 0, time_taken: 0, count: 0 }
    };

    results.forEach(r => {
      if (dataMap[r.attack_type]) {
        dataMap[r.attack_type].attempts += r.attempts;
        dataMap[r.attack_type].time_taken += r.time_taken;
        dataMap[r.attack_type].count += 1;
      }
    });

    return Object.values(dataMap).map(d => ({
      name: d.name,
      attempts: d.count > 0 ? Math.round(d.attempts / d.count) : 0,
      time: d.count > 0 ? Number((d.time_taken / d.count).toFixed(5)) : 0
    }));
  };

  const chartData = processChartData();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-[var(--color-cyber-blue)] mb-2">Attack Results & Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="cyber-card">
          <h2 className="text-xl font-bold mb-6">Average Attempts by Attack Type</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333344" vertical={false} />
                <XAxis dataKey="name" stroke="#a0a0a0" />
                <YAxis stroke="#a0a0a0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a24', borderColor: '#333344', color: '#e0e0e0' }} 
                  itemStyle={{ color: '#00d2ff' }}
                />
                <Legend />
                <Bar dataKey="attempts" name="Avg Attempts" fill="#00d2ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="cyber-card">
          <h2 className="text-xl font-bold mb-6">Average Execution Time (Seconds)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333344" vertical={false} />
                <XAxis dataKey="name" stroke="#a0a0a0" />
                <YAxis stroke="#a0a0a0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a24', borderColor: '#333344', color: '#e0e0e0' }}
                  itemStyle={{ color: '#00ff41' }}
                />
                <Legend />
                <Bar dataKey="time" name="Avg Time (s)" fill="#00ff41" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="cyber-card">
        <h2 className="text-xl font-bold mb-4">Historical Results Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-cyber-border)]">
                <th className="p-3 text-gray-400 font-medium">Date</th>
                <th className="p-3 text-gray-400 font-medium">Attack Type</th>
                <th className="p-3 text-gray-400 font-medium">Status</th>
                <th className="p-3 text-gray-400 font-medium">Attempts</th>
                <th className="p-3 text-gray-400 font-medium">Time (s)</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">No attack results found.</td>
                </tr>
              ) : (
                results.map(r => (
                  <tr key={r.id} className="border-b border-[var(--color-cyber-border)]/50 hover:bg-white/5 transition-colors">
                    <td className="p-3 text-sm">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="p-3 text-[var(--color-cyber-blue)]">{r.attack_type}</td>
                    <td className={`p-3 font-bold ${r.status === 'FOUND' ? 'text-[var(--color-cyber-green)]' : 'text-[var(--color-cyber-red)]'}`}>
                      {r.status}
                    </td>
                    <td className="p-3 font-mono">{r.attempts}</td>
                    <td className="p-3 font-mono">{r.time_taken}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Results;
