import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import CrackingLab from './pages/CrackingLab';
import Results from './pages/Results';
import Logs from './pages/Logs';
import Security from './pages/Security';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cracking" element={<CrackingLab />} />
          <Route path="/results" element={<Results />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/security" element={<Security />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
