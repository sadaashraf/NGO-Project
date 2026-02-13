import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserForm from './components/UserForm';
import MembersList from './components/MembersList';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-form" element={<UserForm />} />
        <Route path="/members" element={<MembersList />} />
      </Routes>
    </Router>
  );
}

export default App;