const ResultCard = ({ result }) => {
  if (!result) return null;

  const isFound = result.status === 'FOUND';

  return (
    <div className={`cyber-card mt-6 border-l-4 ${isFound ? 'border-l-[var(--color-cyber-green)]' : 'border-l-[var(--color-cyber-red)]'}`}>
      <h3 className="text-xl font-bold mb-4 border-b border-[var(--color-cyber-border)] pb-2 uppercase tracking-wider">
        Attack Result
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-sm">Attack Type</p>
          <p className="font-semibold text-lg text-[var(--color-cyber-blue)]">{result.attack_type}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Status</p>
          <p className={`font-bold text-lg ${isFound ? 'text-[var(--color-cyber-green)]' : 'text-[var(--color-cyber-red)]'}`}>
            {isFound ? 'PASSWORD FOUND' : 'PASSWORD NOT FOUND'}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Attempts</p>
          <p className="font-mono text-xl">{result.attempts.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Time Taken</p>
          <p className="font-mono text-xl">{result.time_taken} seconds</p>
        </div>
      </div>

      {isFound && result.recovered_password && (
        <div className="mt-6 p-4 bg-black/50 border border-[var(--color-cyber-green)] rounded flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Recovered Password (Educational Demo)</p>
            <p className="font-mono text-2xl text-[var(--color-cyber-green)] tracking-widest">{result.recovered_password}</p>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-[var(--color-cyber-border)]/50 flex justify-between items-center text-sm text-gray-400">
        <span>Need full candidate hash log inspection?</span>
        <a href="/logs" className="text-[var(--color-cyber-blue)] hover:underline font-semibold">
          View Log Navigation &rarr;
        </a>
      </div>
    </div>
  );
};


export default ResultCard;
