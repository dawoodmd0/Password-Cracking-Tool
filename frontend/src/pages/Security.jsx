import { Shield, ShieldAlert, CheckCircle2 } from 'lucide-react';

const Security = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center py-6 border-b border-[var(--color-cyber-border)]">
        <Shield size={48} className="mx-auto text-[var(--color-cyber-blue)] mb-4" />
        <h1 className="text-3xl font-bold tracking-tight">Security Explanation</h1>
        <p className="text-gray-400 mt-2">
          Understanding the difference between unsalted and salted password hashes.
        </p>
      </div>

      <div className="cyber-card border-l-4 border-l-[var(--color-cyber-red)]">
        <h2 className="text-2xl font-bold mb-4 text-[var(--color-cyber-red)] flex items-center gap-2">
          <ShieldAlert size={24} />
          Vulnerable: Unsalted Hashing
        </h2>
        <p className="text-gray-300 mb-6">
          In our demonstration, passwords are run directly through the SHA-256 algorithm without any modifications. 
          This means identical passwords will always produce identical hashes.
        </p>
        
        <div className="bg-black/50 p-6 rounded-lg font-mono text-sm mb-6 border border-[var(--color-cyber-border)]">
          <div className="text-gray-400 mb-1">User A Password: <span className="text-white">password123</span></div>
          <div className="text-[var(--color-cyber-red)] mb-4">SHA-256 Hash: <br/>ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f</div>
          
          <div className="text-gray-400 mb-1">User B Password: <span className="text-white">password123</span></div>
          <div className="text-[var(--color-cyber-red)]">SHA-256 Hash: <br/>ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f</div>
        </div>

        <h3 className="font-bold text-lg mb-2">Why is this dangerous?</h3>
        <ul className="list-disc pl-5 text-gray-300 space-y-2">
          <li><strong>Precomputation:</strong> Attackers can precalculate hashes for millions of common passwords (Rainbow Tables) and instantly look up targets.</li>
          <li><strong>Pattern Matching:</strong> If an attacker knows User A's password, they instantly know User B has the same password.</li>
          <li><strong>Speed:</strong> Standard algorithms like SHA-256 are designed to be fast, allowing attackers to guess millions of passwords per second.</li>
        </ul>
      </div>

      <div className="cyber-card border-l-4 border-l-[var(--color-cyber-green)]">
        <h2 className="text-2xl font-bold mb-4 text-[var(--color-cyber-green)] flex items-center gap-2">
          <CheckCircle2 size={24} />
          Defense: Salted Hashing
        </h2>
        <p className="text-gray-300 mb-6">
          A "salt" is a random string added to the password before hashing. Because the salt is unique for every user, 
          identical passwords produce entirely different hashes.
        </p>
        
        <div className="bg-black/50 p-6 rounded-lg font-mono text-sm mb-6 border border-[var(--color-cyber-border)]">
          <div className="text-gray-400 mb-1">User A Password: <span className="text-white">password123</span> + Salt A: <span className="text-purple-400">8f2a9c</span></div>
          <div className="text-[var(--color-cyber-green)] mb-4">Hash A: <br/>[Unique Hash Generated for User A]</div>
          
          <div className="text-gray-400 mb-1">User B Password: <span className="text-white">password123</span> + Salt B: <span className="text-purple-400">b3x7e1</span></div>
          <div className="text-[var(--color-cyber-green)]">Hash B: <br/>[Entirely Different Hash Generated for User B]</div>
        </div>

        <h3 className="font-bold text-lg mb-2">Modern Password Storage Guidelines</h3>
        <p className="text-gray-300 mb-4">
          Production systems should <strong>never</strong> use standard hash algorithms like SHA-256 alone for storing passwords. 
          Instead, use dedicated password-hashing functions designed to be intentionally slow (key stretching):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded text-center font-bold text-blue-300">Argon2</div>
          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded text-center font-bold text-blue-300">bcrypt</div>
          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded text-center font-bold text-blue-300">scrypt</div>
        </div>
      </div>
    </div>
  );
};

export default Security;
