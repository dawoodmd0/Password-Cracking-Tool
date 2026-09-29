import { Link } from 'react-router-dom';
import { Shield, BookOpen, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="text-center py-10 border-b border-[var(--color-cyber-border)]">
        <Shield size={64} className="mx-auto text-[var(--color-cyber-blue)] mb-4" />
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Password Cracking Tool</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          An academic cybersecurity demonstration project exploring password vulnerabilities.
        </p>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-lg text-blue-200">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-2 text-blue-400">
          <BookOpen size={20} />
          Educational Objective
        </h2>
        <p>
          This project demonstrates how unsalted password hashes can be vulnerable to password-recovery techniques, 
          including Dictionary Attacks, Hybrid Attacks, and Rainbow Table lookups. It also explains why modern 
          password storage should use unique salts and dedicated password-hashing algorithms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cyber-card flex flex-col items-start hover:border-[var(--color-cyber-blue)] transition-colors">
          <h3 className="text-xl font-bold mb-2">1. Dictionary Attack</h3>
          <p className="text-gray-400 mb-4 flex-1">
            Attempts to find a matching hash by systematically checking all words in a predefined wordlist.
          </p>
          <Link to="/cracking" className="cyber-button w-full text-center">Try Dictionary Attack</Link>
        </div>
        
        <div className="cyber-card flex flex-col items-start hover:border-[var(--color-cyber-blue)] transition-colors">
          <h3 className="text-xl font-bold mb-2">2. Hybrid Attack</h3>
          <p className="text-gray-400 mb-4 flex-1">
            Combines dictionary words with predictable modifications such as appending common numbers or symbols.
          </p>
          <Link to="/cracking" className="cyber-button w-full text-center">Try Hybrid Attack</Link>
        </div>

        <div className="cyber-card flex flex-col items-start hover:border-[var(--color-cyber-blue)] transition-colors">
          <h3 className="text-xl font-bold mb-2">3. Rainbow Table</h3>
          <p className="text-gray-400 mb-4 flex-1">
            Uses a precomputed mapping of hashes to their corresponding plaintext passwords for extremely fast lookups.
          </p>
          <Link to="/cracking" className="cyber-button w-full text-center">Try Rainbow Table</Link>
        </div>
      </div>

      <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-lg text-red-200/80 mt-10">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-2 text-red-400">
          <AlertTriangle size={18} />
          Security Disclaimer
        </h2>
        <p className="text-sm">
          This application is designed strictly for authorized educational testing within a local environment. 
          It uses locally generated test credentials and simple SHA-256 to demonstrate vulnerabilities. 
          It does not contain functionality to attack real accounts, external services, or extract stolen credentials.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
