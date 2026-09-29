import { Link } from 'react-router-dom';
import { Shield, Home, Users, Lock, BarChart2, ShieldAlert, Terminal } from 'lucide-react';


const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 border-b border-[var(--color-cyber-border)] bg-[var(--color-cyber-card)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold flex items-center gap-2 text-[var(--color-cyber-green)]">
            <Shield size={24} />
            Password Cracking Tool
          </Link>
          <div className="flex gap-6">
            <Link to="/" className="flex items-center gap-2 hover:text-[var(--color-cyber-blue)] transition-colors">
              <Home size={18} /> Dashboard
            </Link>
            <Link to="/register" className="flex items-center gap-2 hover:text-[var(--color-cyber-blue)] transition-colors">
              <Users size={18} /> Test Accounts
            </Link>
            <Link to="/cracking" className="flex items-center gap-2 hover:text-[var(--color-cyber-blue)] transition-colors">
              <Lock size={18} /> Cracking Lab
            </Link>
            <Link to="/results" className="flex items-center gap-2 hover:text-[var(--color-cyber-blue)] transition-colors">
              <BarChart2 size={18} /> Results
            </Link>
            <Link to="/logs" className="flex items-center gap-2 hover:text-[var(--color-cyber-blue)] transition-colors">
              <Terminal size={18} /> Attack Logs
            </Link>
            <Link to="/security" className="flex items-center gap-2 hover:text-[var(--color-cyber-blue)] transition-colors">
              <ShieldAlert size={18} /> Security
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        {children}
      </main>
      <footer className="border-t border-[var(--color-cyber-border)] p-6 text-center text-gray-500 text-sm mt-auto">
        Educational Cybersecurity Demonstration Project - For Local Testing Only
      </footer>
    </div>
  );
};

export default Layout;
