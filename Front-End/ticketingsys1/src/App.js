import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;