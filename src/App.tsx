import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/User/Home';
import LoginPage from './pages/User/Login';
import DriverLoginPage from './pages/Driver/LoginDriver';
import HomeDriver from './pages/Driver/Home';

function App() {
  
  return (
   <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/driver/login" element={<DriverLoginPage />} />
      <Route path="/driver/dashboard" element={<HomeDriver />} />
    </Routes>
  );
}

export default App;