import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import DriverLoginPage from './pages/DriverLogin';
import DriverDashboard from './pages/DriverDashboard';

function App() {
  
  return (
   <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/driver/login" element={<DriverLoginPage />} />
      <Route path="/driver/dashboard" element={<DriverDashboard />} />
    </Routes>
  );
}

export default App;