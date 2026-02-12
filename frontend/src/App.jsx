import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserForm from './components/UserForm';
import MembersList from './components/MembersList';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/" element={<UserForm />} />
        <Route path="/members" element={<MembersList />} />
      </Routes>
    </Router>
  );
}

export default App;